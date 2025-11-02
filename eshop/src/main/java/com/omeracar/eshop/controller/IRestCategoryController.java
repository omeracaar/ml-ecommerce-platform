package com.omeracar.eshop.controller;

import com.omeracar.eshop.dto.category.CategoryRequestDto;
import com.omeracar.eshop.dto.category.CategoryResponseDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IRestCategoryController {

    ResponseEntity<RootEntity<List<CategoryResponseDto>>> getAllCategories();

    ResponseEntity<RootEntity<CategoryResponseDto>> getCategoryById(Long id);

    ResponseEntity<RootEntity<CategoryResponseDto>> createCategory(CategoryRequestDto createDto);

    ResponseEntity<RootEntity<CategoryResponseDto>> updateCategory(Long id, CategoryRequestDto updateDto);

    ResponseEntity<RootEntity<Void>> deleteCategory(Long id);

}
