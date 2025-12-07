package com.omeracar.eshop.dto.product;

import lombok.Data;

@Data
public class ProductResponseDto {

    private String id; // String id (Pxxxxxx)
    private String name;
    private String description;
    private double price;
    private int stockQuantity;
    private String imageUrl;
    private String categoryName; // Category ID yerine adını gösterelim
    private Long categoryId; //frontennde belki ihtiyacım olur
    private String brand;
}
