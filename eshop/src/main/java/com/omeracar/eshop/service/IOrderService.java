package com.omeracar.eshop.service;

import com.omeracar.eshop.dto.order.OrderResponseDto;
import com.omeracar.eshop.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public interface IOrderService {

    OrderResponseDto createOrderFromCart(String shippingAddress);

    List<OrderResponseDto> getOrdersForCurrentUser();

    Optional<OrderResponseDto> getOrderByIdForCurrentUser(Long orderId);

    Page<OrderResponseDto> getAllOrders(Pageable pageable);//admin

    OrderResponseDto updateOrderStatus(Long orderId, OrderStatus status);//admin
}
