package com.omeracar.eshop.controller.impl;

import com.omeracar.eshop.controller.IRestCategoryController;
import com.omeracar.eshop.controller.RestBaseController;
import com.omeracar.eshop.controller.RootEntity;
import com.omeracar.eshop.dto.category.CategoryRequestDto;
import com.omeracar.eshop.dto.category.CategoryResponseDto;
import com.omeracar.eshop.exception.ResourceNotFoundException;
import com.omeracar.eshop.service.impl.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/api/categories")
public class RestCategoryControllerImpl extends RestBaseController implements IRestCategoryController {

    @Autowired
    private CategoryService categoryService;

    @Override
    @GetMapping
    public ResponseEntity<RootEntity<List<CategoryResponseDto>>> getAllCategories() {
        List<CategoryResponseDto> categories = categoryService.getAllCategories();
        return ok(categories);
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<RootEntity<CategoryResponseDto>> getCategoryById(
            @PathVariable Long id) {
        CategoryResponseDto categoryResponseDto = categoryService.getCategoryById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category","id",id));
        return ok(categoryResponseDto);
    }

    @Override
    @PostMapping("/admin")
    public ResponseEntity<RootEntity<CategoryResponseDto>> createCategory(
            @Valid @RequestBody CategoryRequestDto createDto) {
        CategoryResponseDto categoryResponseDto=categoryService.createCategory(createDto);
        return created(categoryResponseDto);
    }

    @Override
    @PutMapping("/admin/{id}")
    public ResponseEntity<RootEntity<CategoryResponseDto>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDto updateDto) {
        CategoryResponseDto categoryResponseDto=categoryService.updateCategory(id,updateDto);
        return ok(categoryResponseDto);
    }

    @Override
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<RootEntity<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return noContent();
    }
}
