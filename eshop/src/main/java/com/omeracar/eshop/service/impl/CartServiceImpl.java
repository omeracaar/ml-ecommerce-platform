package com.omeracar.eshop.service.impl;

import com.omeracar.eshop.dto.cart.AddItemToCartRequestDto;
import com.omeracar.eshop.dto.cart.CartItemDto;
import com.omeracar.eshop.dto.cart.CartResponseDto;
import com.omeracar.eshop.exception.BadRequestException;
import com.omeracar.eshop.exception.MessageType;
import com.omeracar.eshop.exception.ResourceNotFoundException;
import com.omeracar.eshop.model.Cart;
import com.omeracar.eshop.model.CartItem;
import com.omeracar.eshop.model.Product;
import com.omeracar.eshop.model.User;
import com.omeracar.eshop.repository.CartItemRepository;
import com.omeracar.eshop.repository.CartRepository;
import com.omeracar.eshop.repository.ProductRepository;
import com.omeracar.eshop.repository.UserRepository;
import com.omeracar.eshop.service.ICartService;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements ICartService {

    private static final Logger logger= LoggerFactory.getLogger(CartServiceImpl.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    //removeCartItem methodunda sikinti yasadigim icin ekledim
    @Autowired
    private EntityManager entityManager;

    private User getCurrentUser(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        if (authentication==null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())){
            throw new BadRequestException("Sepete atma islemi icin giris yapmis olmalisiniz", MessageType.UNAUTHORIZED);
        }

        String username=authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(()->{
                    logger.error("kimligi dogrulanmis kullanici db de bulunamadi: {}",username);
                    //eger buraya kadar girerse bi sikinti var girmemesi lazim
                    return new UsernameNotFoundException("giris yapmis kullanici db de bulunamadi: "+username);
                });
    }

    private Cart getOrCreateCartForUser(User user){
        return cartRepository.findByUser(user).orElseGet(()->{
            logger.info("kullanici '{}' icin yeni sepet olusuturluyor",user.getUsername());
            Cart cart=new Cart();
            cart.setUser(user);
            cart.setCartItems(new ArrayList<>());
            return cartRepository.save(cart);
        });
    }

    private CartResponseDto convertToDto(Cart cart){
        CartResponseDto cartDto=new CartResponseDto();
        cartDto.setId(cart.getId());
        cartDto.setUserId(cart.getUser() !=null ? cart.getUser().getId() : null);

        List<CartItemDto> itemDtos = new ArrayList<>();
        double totalPrice = 0;
        int totalItems = 0;

        if (cart.getCartItems() != null){
            for (CartItem item: cart.getCartItems()){
                CartItemDto itemDto=new CartItemDto();
                itemDto.setId(item.getId());
                itemDto.setQuantity(item.getQuantity());
                if (item.getProduct() != null) {
                    Product product = item.getProduct();
                    itemDto.setProductId(product.getId());
                    itemDto.setProductName(product.getName());
                    itemDto.setImageUrl(product.getImageUrl());
                    itemDto.setPrice(product.getPrice());
                    itemDto.setLineTotal(product.getPrice() * item.getQuantity());
                    totalPrice += itemDto.getLineTotal();
                }
                itemDtos.add(itemDto);
                totalItems += item.getQuantity();
            }
            }

        cartDto.setCartItems(itemDtos);
        cartDto.setTotalPrice(totalPrice);
        cartDto.setTotalItems(totalItems);
        return cartDto;
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponseDto getCartForCurrentUser() {
        User currnetUser=getCurrentUser();
        Cart cart=getOrCreateCartForUser(currnetUser);
        return convertToDto(cart);
    }

    @Override
    @Transactional
    public CartResponseDto addItemToCart(AddItemToCartRequestDto addItemDto) {
        User currentUser=getCurrentUser();
        Cart cart=getOrCreateCartForUser(currentUser);

        //urunu bul
        Product product=productRepository.findById(addItemDto.getProductId())
                .orElseThrow(()-> new ResourceNotFoundException("product ","id",addItemDto.getProductId()));

        //stok kontrolu
        if (product.getStockQuantity()< addItemDto.getQuantity()){
            throw new BadRequestException("yetersiz stok. istenen: "+addItemDto.getQuantity()+" , stoktaki miktari: "+product.getStockQuantity());
        }

        //sepette zaten var mi onun kontrolu
        Optional<CartItem> existingItemOpt=cartItemRepository.findByCartAndProduct(cart,product);

        if (existingItemOpt.isPresent()){
            //urun zaten varsa miktar arttir
            CartItem existingItem=existingItemOpt.get();
            int newQuantity=existingItem.getQuantity()+addItemDto.getQuantity();

            //tekrar stok kontrolu
            if (product.getStockQuantity()< newQuantity){
                throw new BadRequestException("yetersiz stok. istenen: "+newQuantity+" , stoktaki miktari: "+product.getStockQuantity());
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
            logger.info("sepetteki ürün '{}', miktarı {} olarak guncellendi (User: {})",product.getName(),newQuantity,currentUser.getUsername());
        }else {
            //urun sepette yoksa yeni cartItem olustur
            CartItem newItem=new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(addItemDto.getQuantity());
            cartItemRepository.save(newItem);
            //@OneToMany sayesinde cart.getCartItems().add(newItem) yapmaya gerek yok
            logger.info("sepete yeni urun eklendi: {} ({} adet) (User: {})",product.getName(),addItemDto.getQuantity(),currentUser.getUsername());
        }

        //stogu satin alimdan sonra dusurdum
        Cart updatedCart=cartRepository.findById(cart.getId()).orElse(cart);
        return convertToDto(updatedCart);
    }

    @Override
    public CartResponseDto updateCartItemQuantity(Long cartItemId, Integer quantity) {
        if (quantity<1){
            throw new BadRequestException("miktar en az 1 olmali, silme islemi icin delete endpoint kullan");
        }

        User currentUser=getCurrentUser();
        Cart cart=getOrCreateCartForUser(currentUser);

        CartItem cartItem=cartItemRepository.findById(cartItemId)
                .orElseThrow(()->new ResourceNotFoundException("CartItem","id",cartItemId));

        //item dogru user'a mi ait kontrolu
        if (!cartItem.getCart().getId().equals(cart.getId())){
            logger.warn("yetkisiz sepet guncelleme denemesi. User: {}, istenen item id {}",currentUser.getUsername(),cartItemId);
            throw new BadRequestException("sepeti guncelleme yetkiniz yok.",MessageType.FORBIDDEN);
        }
        //yeni miktar icin stok kontrolu
        Product product=cartItem.getProduct();
        if (product.getStockQuantity()<quantity){
            throw new BadRequestException("yetersiz stok. istenen miktar: "+quantity+"mevuct miktar: "+product.getStockQuantity());
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        logger.info("sepet id: {} miktarı {} olarak guncellendi (User: {})",cartItemId,quantity,currentUser.getUsername());

        Cart updatedCart=cartRepository.findById(cart.getId()).orElse(cart);
        return convertToDto(updatedCart);
    }


    @Override
    @Transactional
    public CartResponseDto removeCartItem(Long cartItemId) {
        User currentUser = getCurrentUser();
        Cart cart = getOrCreateCartForUser(currentUser);
        logger.debug("removeCartItem cagirildi. User: {}, cart ID: {}, removeCartItem ID: {}",
                currentUser.getUsername(), cart.getId(), cartItemId);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Bu cartItem'i silme yetkiniz yok.", MessageType.FORBIDDEN);
        }
        try {
            cartItemRepository.delete(cartItem);
            //!!!!!!!!! yapilan degisiklikleri hemen yapmaya zorla
            //aksi takdirde cartItem silmiyor
            entityManager.flush();
            entityManager.refresh(cart);
        } catch (Exception e) {
            throw new RuntimeException("cartItem silinirken veritabanı hatası oluştu.", e);
        }
        return convertToDto(cart);
    }

    @Override
    @Transactional
    public CartResponseDto clearCart() {
        User currentUser=getCurrentUser();
        Cart cart=getOrCreateCartForUser(currentUser);

        List<CartItem> itemsToDelete = cart.getCartItems();
        if (itemsToDelete != null && !itemsToDelete.isEmpty()) {
            logger.debug("sepette {} adet item silinecek", itemsToDelete.size());

            cartItemRepository.deleteAllInBatch(itemsToDelete); // deleteAll yapinca rollback e dusuyor
            entityManager.flush();//db ye delete islemini hemen at dedim
        }

        logger.info("User '{}' sepeti temizlendi.", currentUser.getUsername());

        //ne olur ne olmaz :)
        CartResponseDto emptyCartDto = new CartResponseDto();
        emptyCartDto.setId(cart.getId());
        emptyCartDto.setUserId(currentUser.getId());
        emptyCartDto.setCartItems(new ArrayList<>());
        emptyCartDto.setTotalPrice(0.0);
        emptyCartDto.setTotalItems(0);
        return emptyCartDto;

    }
}
