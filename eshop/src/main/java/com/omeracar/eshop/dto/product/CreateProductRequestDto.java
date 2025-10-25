package com.omeracar.eshop.dto.product;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateProductRequestDto {

    // Ürün ID'si ML modelinden alınacak ve Servis katmanında set edilecek,
    // o yüzden burada ID'yi request'ten almıyoruz.
    // Ancak, CSV'deki ID'yi de adminin girmesini isteyebiliriz, bu bir tasarım kararı.
    // Şimdilik Servis'te ID oluşturacağımızı varsayalım.
    // Eğer adminin CSV'deki ID'yi girmesini istiyorsak buraya ekleriz:

    @NotBlank(message = "ürün id bos olamaz(örn:Pxxxxxx)")
    @Size(min = 3,message = "ürün id min 3 karakter olmali")
    private String id;

    @NotBlank(message = "ürün adi bos olamaz")
    @Size(min = 3,message = "ürün adi min 3 karakter olmali")
    private String name;

    @Size(max = 1000, message = "Açıklama en fazla 1000 karakter olabilir")
    private String description;

    @NotNull(message = "Fiyat boş olamaz")
    @Positive(message = "Fiyat negatif ve 0 olamaz")
    private Double price;

    @NotNull(message = "Stok adedi boş olamaz")
    @Min(value = 0, message = "Stok adedi negatif olamaz")
    private Integer stockQuantity;

    @NotBlank(message = "Resim URL i boş olamaz")
    @Size(max = 2048, message = "Resim URL'si çok uzun")
    @Pattern(regexp = "^(http|https)://.*", message = "Geçerli bir URL giriniz")
    private String imageUrl;

    @NotNull(message = "Kategori id boş olamaz")
    private Long categoryId;

}
