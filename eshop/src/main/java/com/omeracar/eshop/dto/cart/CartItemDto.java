package com.omeracar.eshop.dto.cart;

import lombok.Data;

import java.util.logging.Logger;

@Data
public class CartItemDto {

    private Long id;
    private String productId;
    private String productName;
    private String imageUrl;
    private double price;
    private int quantity;
    private double lineTotal;
}
