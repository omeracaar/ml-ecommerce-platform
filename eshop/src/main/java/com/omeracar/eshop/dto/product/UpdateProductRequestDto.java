package com.omeracar.eshop.dto.product;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateProductRequestDto {

    // ID, URL path'inden (/api/admin/products/{id}) alınacak

    @NotBlank(message = "Ürün adı boş olamaz")
    @Size(min = 3, max = 255, message = "Ürün adı 3 ile 255 karakter arasında olmalı")
    private String name;

    @Size(max = 1000, message = "Açıklama en fazla 1000 karakter olabilir")
    private String description;

    @NotNull(message = "Fiyat boş olamaz")
    @PositiveOrZero(message = "Fiyat negatif olamaz")
    private Double price;

    @NotNull(message = "Stok adedi boş olamaz")
    @Min(value = 0, message = "Stok adedi negatif olamaz")
    private Integer stockQuantity;

    @NotBlank(message = "Resim URL'si boş olamaz")
    @Size(max = 2048, message = "Resim URL'si çok uzun")
    @Pattern(regexp = "^(http|https)://.*", message = "Geçerli bir URL giriniz")
    private String imageUrl;

    @NotNull(message = "Kategori ID'si boş olamaz")
    private Long categoryId;
}
