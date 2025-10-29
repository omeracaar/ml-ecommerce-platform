package com.omeracar.eshop.dto.order;

import com.omeracar.eshop.model.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDto {

    private Long id;
    private String userId;
    private String username;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus; //(PENDING, PROCESSING vs)
    private double totalPrice;
    private String shippingAddress;
    private List<OrderItemDto> orderItems;
    private  int totalItemsInOrder;
}
