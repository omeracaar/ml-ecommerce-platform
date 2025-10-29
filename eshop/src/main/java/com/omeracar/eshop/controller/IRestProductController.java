package com.omeracar.eshop.controller;

import com.omeracar.eshop.dto.product.CreateProductRequestDto;
import com.omeracar.eshop.dto.product.ProductResponseDto;
import com.omeracar.eshop.dto.product.UpdateProductRequestDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface IRestProductController {

    ResponseEntity<RootEntity<Page<ProductResponseDto>>> getAllProducts(Pageable pageable);

    ResponseEntity<RootEntity<ProductResponseDto>> getProductById(String id);

    ResponseEntity<RootEntity<Page<ProductResponseDto>>> getProductsByCategory(Long categoryId, Pageable pageable);

    ResponseEntity<RootEntity<ProductResponseDto>> addProduct(CreateProductRequestDto createDto);

    ResponseEntity<RootEntity<ProductResponseDto>> updateProduct(String id,UpdateProductRequestDto updateDto);

    ResponseEntity<RootEntity<Void>> deleteProduct(String id);

}
