package com.omeracar.eshop.service.impl;

import com.omeracar.eshop.dto.category.CategoryRequestDto;
import com.omeracar.eshop.dto.category.CategoryResponseDto;
import com.omeracar.eshop.exception.BadRequestException;
import com.omeracar.eshop.exception.ResourceNotFoundException;
import com.omeracar.eshop.model.Category;
import com.omeracar.eshop.repository.CategoryRepository;
import com.omeracar.eshop.repository.ProductRepository;
import com.omeracar.eshop.service.ICategoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService implements ICategoryService {

    private static final Logger logger= LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private CategoryResponseDto convertToDto(Category category){
        CategoryResponseDto dto=new CategoryResponseDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());

        return dto;
    }

    private  Category converToEntity(CategoryRequestDto dto){
        Category category=new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        return category;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CategoryResponseDto> getCategoryById(Long id) {
        return categoryRepository.findById(id).map(this::convertToDto);
    }

    @Override
    @Transactional
    public CategoryResponseDto createCategory(CategoryRequestDto createDto) {
        categoryRepository.findByName(createDto.getName()).ifPresent(c -> {
            logger.warn("Kategori olusturulamadi. isim zaten var: {}", createDto.getName());
            throw new BadRequestException(""+createDto.getName()+"already exists");
            });
        Category category=converToEntity(createDto);
        Category savedCategory=categoryRepository.save(category);

        return convertToDto(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponseDto updateCategory(Long id, CategoryRequestDto updateDto) {
        Category existingCategory=categoryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Kategori guncelleme basarisiz. id {} bulunamadı.", id);
                    return new ResourceNotFoundException("Category", "id", id);
                });
        existingCategory.setName(updateDto.getName());
        existingCategory.setDescription(updateDto.getDescription());

        Category updatedCategory = categoryRepository.save(existingCategory);

        return convertToDto(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category=categoryRepository.findById(id)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("Category", "id", id);
                });

        if (!productRepository.findByCategoryId(id).isEmpty()) {
            throw new BadRequestException("bu category silinemez cunku category'ye bagli urunler var");
        }

        categoryRepository.delete(category);
    }
}
