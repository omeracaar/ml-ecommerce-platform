package com.omeracar.eshop.controller;

import com.omeracar.eshop.dto.order.OrderResponseDto;
import com.omeracar.eshop.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IRestOrderController {

    ResponseEntity<RootEntity<OrderResponseDto>> createOrderFromCart(String shippingAddress); // Adresi @RequestParam veya @RequestBody ile alacağız


    ResponseEntity<RootEntity<List<OrderResponseDto>>> getCurrentUserOrders();


    ResponseEntity<RootEntity<OrderResponseDto>> getCurrentUserOrderById(Long orderId);


    ResponseEntity<RootEntity<Page<OrderResponseDto>>> getAllOrders(Pageable pageable);


    ResponseEntity<RootEntity<OrderResponseDto>> updateOrderStatus(Long orderId, OrderStatus status);
}
