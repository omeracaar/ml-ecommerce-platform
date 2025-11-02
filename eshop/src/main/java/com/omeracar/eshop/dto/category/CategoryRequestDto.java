package com.omeracar.eshop.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequestDto {

    @NotBlank(message = "Kategori adı boş olamaz")
    @Size(min = 2, max = 100, message = "Kategori adı 2 ile 100 karakter arasında olmalıdır")
    private String name;

    @Size(max = 500, message = "Açıklama 500 karakterden uzun olamaz")
    private String description;

}
