package com.omeracar.eshop.service.impl;

import com.omeracar.eshop.dto.order.OrderItemDto;
import com.omeracar.eshop.dto.order.OrderResponseDto;
import com.omeracar.eshop.exception.BadRequestException;
import com.omeracar.eshop.exception.BaseException;
import com.omeracar.eshop.exception.MessageType;
import com.omeracar.eshop.exception.ResourceNotFoundException;
import com.omeracar.eshop.model.*;
import com.omeracar.eshop.model.enums.OrderStatus;
import com.omeracar.eshop.repository.*;
import com.omeracar.eshop.service.IOrderService;
import jakarta.persistence.EntityManager;
import org.aspectj.weaver.ast.Or;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements IOrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BadRequestException("siparis icin giris yapmis olmalisiniz", MessageType.FORBIDDEN);
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("giris yapmis kullanici db de bulunamadi: " + username));
    }

    private OrderItemDto convertOrderItemToDto(OrderItem orderItem) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(orderItem.getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPriceAtPurchase(orderItem.getPriceAtPurchase());
        dto.setLineTotal(orderItem.getPriceAtPurchase() * orderItem.getQuantity());
        if (orderItem.getProduct() != null) {
            Product product = orderItem.getProduct();
            dto.setProductId(product.getId());
            dto.setProductName(product.getName());
            dto.setImageUrl(product.getImageUrl());
        }
        return dto;
    }

    private OrderResponseDto convertOrderToDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        dto.setUsername(order.getUser() != null ? order.getUser().getUsername() : "anonymous User");
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setShippingAddress(order.getShippingAddress());

        if (order.getOrderItems() != null) {
            List<OrderItemDto> itemDto = order.getOrderItems().stream()
                    .map(this::convertOrderItemToDto)
                    .collect(Collectors.toList());
            dto.setOrderItems(itemDto);
            dto.setTotalItemsInOrder(itemDto.stream().mapToInt(OrderItemDto::getQuantity).sum());
        } else {
            dto.setOrderItems(new ArrayList<>());
            dto.setTotalItemsInOrder(0);
            //null pointer yememek icin
        }
        return dto;

    }

    @Override
    @Transactional
    public OrderResponseDto createOrderFromCart(String shippingAddress) {
        User user = getCurrentUser();
        logger.info("user '{}' icin sepetten siparis olusturuluyor", user.getUsername());

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("sepet bulunamadi."));

        List<CartItem> cartItems = cart.getCartItems();
        if (cartItems == null || cartItems.isEmpty()) {
            throw new BadRequestException("siparis olsturmak icin sepetiniz bos olamaz.");
        }

        double calculatedTotalPrice = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        logger.debug("stok kontrolu ve orderItem olusturuluyor");
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            int requestedQuantity = cartItem.getQuantity();

            //stok kontrolu
            if (product.getStockQuantity() < requestedQuantity) {
                logger.warn("yetersiz stok, urun: {} istenen: {}, stok mikari: {}",
                        product.getName(), requestedQuantity, product.getStockQuantity());
                new BadRequestException("stok yetersiz: " + product.getName() + " stok miktari: " + product.getStockQuantity());
            }

            OrderItem orderItem=new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(requestedQuantity);
            orderItem.setPriceAtPurchase(product.getPrice());

            orderItems.add(orderItem);
            calculatedTotalPrice+=orderItem.getPriceAtPurchase()*orderItem.getQuantity();

            //stok dusurme
            int newStock=product.getStockQuantity()-requestedQuantity;
            product.setStockQuantity(newStock);
            logger.debug("urun '{}' stogu {} -> {} olarak güncellendi (henuz commit edilmedi).", product.getName(), product.getStockQuantity() + requestedQuantity, newStock);
        }
        logger.debug("stok kontrolu tamamlandi, toplam fiyat: {}",calculatedTotalPrice);

        //siparisi olusturma
        Order newOrder=new Order();
        newOrder.setUser(user);
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setOrderStatus(OrderStatus.PROCESSING);
        newOrder.setTotalPrice(calculatedTotalPrice);
        newOrder.setShippingAddress(shippingAddress !=null ? shippingAddress : user.getAddress());

        //orderItemler i order a ekle
        for (OrderItem item:orderItems){
            item.setOrder(newOrder);
        }
        newOrder.setOrderItems(orderItems);

        Order savedOrder=orderRepository.save(newOrder);
        logger.info("id'si {} olan siparis basariyla kaydedildi",savedOrder.getId());

        logger.debug("Stok değişiklikleri için EntityManager flush çağrılıyor...");
        entityManager.flush();//degisiklikleri db ye hemen yazdirmak icin
        logger.debug("EntityManager flush tamamlandı.");

        logger.debug("Sipariş sonrası sepet (ID: {}) temizleniyor...", cart.getId());
        cartItemRepository.deleteAllInBatch(cartItems);//satin alimdan sonra sepeti temizle
        entityManager.flush();
        logger.info("Sepet başarıyla temizlendi.");

        return convertOrderToDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersForCurrentUser() {
        User user=getCurrentUser();
        logger.debug("Kullanıcı '{}' için siparişler getiriliyor...", user.getUsername());
        List<Order> orders=orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
        return orders.stream()
                .map(this::convertOrderToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrderResponseDto> getOrderByIdForCurrentUser(Long orderId) {
        User user=getCurrentUser();
        logger.debug("Kullanıcı '{}' için sipariş ID {} detayları getiriliyor...", user.getUsername(), orderId);
        Optional<Order> orderOpt=orderRepository.findById(orderId);

        //siparis var mi ve bu kullaniciya mi ait kontrolu
        if (orderOpt.isPresent() && orderOpt.get().getUser().getId().equals(user.getId())){
            return orderOpt.map(this::convertOrderToDto);
        }else if (orderOpt.isPresent()){
            logger.warn("yetkisiz siparis goruntuleme denemesi user: {}, istenen siparis id: {}", user.getUsername(), orderId);
            return Optional.empty();
        }else{//siparis yoksa
            return Optional.empty();
        }

    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDto> getAllOrders(Pageable pageable) {
        logger.debug("tum siparisler page halde getiriliyor");
        Page<Order> orderPage = orderRepository.findAll(pageable);
        return orderPage.map(this::convertOrderToDto);
    }

    @Override
    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, OrderStatus status) {
        logger.info("admin tarafidan siparis id {} durumu {} olarak guncelleniyor",orderId,status);
        Order order=orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("order", "id", orderId));
        order.setOrderStatus(status);
        Order updatedOrder = orderRepository.save(order);
        logger.info("siparis id: {} durumu {} olarak guncellendi",orderId,status);

        return convertOrderToDto(updatedOrder);
    }
}
