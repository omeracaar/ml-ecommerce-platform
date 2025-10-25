package com.omeracar.eshop.service;

import com.omeracar.eshop.dto.product.CreateProductRequestDto;
import com.omeracar.eshop.dto.product.ProductResponseDto;
import com.omeracar.eshop.dto.product.UpdateProductRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface IProductService {

    Page<ProductResponseDto> getAllProducts(Pageable pageable);

    Optional<ProductResponseDto> getProductById(String id);

    ProductResponseDto addProduct(CreateProductRequestDto createDto);

    ProductResponseDto updateProduct(String id, UpdateProductRequestDto updateDto);

    void deleteProduct(String id);

    Page<ProductResponseDto> getProductsByCategory(Long categoryId, Pageable pageable);
}
