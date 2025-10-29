package com.omeracar.eshop.dto.order;

import lombok.Data;

@Data
public class OrderItemDto {

    private Long id;
    private String productId;
    private String productName;
    private String imageUrl;
    private int quantity;
    private double priceAtPurchase;
    private double lineTotal;
}
