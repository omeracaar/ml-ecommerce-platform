package com.omeracar.eshop.dto.cart;

import lombok.Data;

import java.util.List;

@Data
public class CartResponseDto {

    private Long id;
    private String userId;
    private List<CartItemDto> cartItems;
    private double totalPrice;
    private int totalItems;

}
