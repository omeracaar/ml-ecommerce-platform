package com.omeracar.eshop.service;

import com.omeracar.eshop.dto.category.CategoryRequestDto;
import com.omeracar.eshop.dto.category.CategoryResponseDto;

import java.util.List;
import java.util.Optional;

public interface ICategoryService {

    List<CategoryResponseDto> getAllCategories();
    Optional<CategoryResponseDto> getCategoryById(Long id);
    CategoryResponseDto createCategory(CategoryRequestDto createDto);
    CategoryResponseDto updateCategory(Long id, CategoryRequestDto updateDto);
    void deleteCategory(Long id);
}
