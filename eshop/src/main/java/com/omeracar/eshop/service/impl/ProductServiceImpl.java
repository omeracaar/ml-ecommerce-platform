package com.omeracar.eshop.service.impl;

import com.omeracar.eshop.dto.product.CreateProductRequestDto;
import com.omeracar.eshop.dto.product.ProductResponseDto;
import com.omeracar.eshop.dto.product.UpdateProductRequestDto;
import com.omeracar.eshop.exception.BadRequestException;
import com.omeracar.eshop.exception.ResourceNotFoundException;
import com.omeracar.eshop.model.Category;
import com.omeracar.eshop.model.Product;
import com.omeracar.eshop.repository.CategoryRepository;
import com.omeracar.eshop.repository.ProductRepository;
import com.omeracar.eshop.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ProductServiceImpl implements IProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private ProductResponseDto convertToDto(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setImageUrl(product.getImageUrl());
        // Category null değilse adını ve id sini al
        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
            dto.setCategoryId(product.getCategory().getId());
        }
        return dto;
    }

    private Product convertToEntity(CreateProductRequestDto createDto) {
        Product product = new Product();
        product.setId(createDto.getId());
        product.setName(createDto.getName());
        product.setDescription(createDto.getDescription());
        product.setPrice(createDto.getPrice());
        product.setStockQuantity(createDto.getStockQuantity());
        product.setImageUrl(createDto.getImageUrl());
        return product;
    }



    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductResponseDto> getProductById(String id) {
        return productRepository.findById(id)
                .map(this::convertToDto);
    }

    @Override
    @Transactional
    public ProductResponseDto addProduct(CreateProductRequestDto createDto) {
        Category category=categoryRepository.findById(createDto.getCategoryId())
                .orElseThrow(()->new ResourceNotFoundException("Category","id",createDto.getCategoryId()));

        if (productRepository.existsById(createDto.getId())){
            throw new BadRequestException("Product id "+createDto.getId()+" already exists");

        }
        Product product=convertToEntity(createDto);
        product.setCategory(category);
        Product savedProduct=productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponseDto updateProduct(String id, UpdateProductRequestDto updateDto) {
        Product existingProduct=productRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Product","id",id));

        existingProduct.setName(updateDto.getName());
        existingProduct.setDescription(updateDto.getDescription());
        existingProduct.setPrice(updateDto.getPrice());
        existingProduct.setStockQuantity(updateDto.getStockQuantity());
        existingProduct.setImageUrl(updateDto.getImageUrl());

        if (!existingProduct.getCategory().getId().equals(updateDto.getCategoryId())){
            Category category=categoryRepository.findById(updateDto.getCategoryId())
                    .orElseThrow(()->new ResourceNotFoundException("Category","id",updateDto.getCategoryId()));
            existingProduct.setCategory(new Category());
        }

        Product updatedProduct=productRepository.save(existingProduct);

        return convertToDto(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)){
            throw new ResourceNotFoundException("Product","id",id);
        }
        productRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> getProductsByCategory(Long categoryId,Pageable pageable) {
        if (!categoryRepository.existsById(categoryId)){
            throw new ResourceNotFoundException("Category","id",categoryId);
        }

        Page<Product> productPage = productRepository.findByCategoryId(categoryId, pageable);

        return productPage.map(this::convertToDto);
    }
}
