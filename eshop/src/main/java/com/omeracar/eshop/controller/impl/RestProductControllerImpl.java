package com.omeracar.eshop.controller.impl;

import com.omeracar.eshop.controller.IRestProductController;
import com.omeracar.eshop.controller.RestBaseController;
import com.omeracar.eshop.controller.RootEntity;
import com.omeracar.eshop.dto.product.CreateProductRequestDto;
import com.omeracar.eshop.dto.product.ProductResponseDto;
import com.omeracar.eshop.dto.product.UpdateProductRequestDto;
import com.omeracar.eshop.exception.ResourceNotFoundException;
import com.omeracar.eshop.service.IProductService;
import com.omeracar.eshop.service.IRecommendationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("rest/api/products")
public class RestProductControllerImpl extends RestBaseController implements IRestProductController {

    @Autowired
    private IProductService iProductService;

    @Autowired
    private IRecommendationService recommendationService;


    @Override
    @GetMapping("/getAll")
    public ResponseEntity<RootEntity<Page<ProductResponseDto>>> getAllProducts(
            @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
            //ustteki satirda ne zaman urun satin alimi yapsam stok miktari degistigi icin ana sayfa duzeni bozuluyordu bunla id'ye gore siraladim

        Page<ProductResponseDto> products=iProductService.getAllProducts(pageable);
        return ok(products);
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<RootEntity<ProductResponseDto>> getProductById(@PathVariable String id) {

        ProductResponseDto productDto=iProductService.getProductById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Product","id",id));
        return ok(productDto);
    }

    @Override
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<RootEntity<Page<ProductResponseDto>>> getProductsByCategory(
            @PathVariable Long categoryId, Pageable pageable) {
        Page<ProductResponseDto> products=iProductService.getProductsByCategory(categoryId,pageable);
        return ok(products);
    }

    @Override
    @PostMapping("/admin")
    public ResponseEntity<RootEntity<ProductResponseDto>> addProduct(
            @Valid @RequestBody CreateProductRequestDto createDto) {
        ProductResponseDto saveProduct=iProductService.addProduct(createDto);
        return created(saveProduct);
    }

    @Override
    @PutMapping("/admin/{id}")
    public ResponseEntity<RootEntity<ProductResponseDto>> updateProduct(
            @PathVariable String id, @Valid @RequestBody UpdateProductRequestDto updateDto) {
        ProductResponseDto updatedProduct=iProductService.updateProduct(id,updateDto);
        return ok(updatedProduct);
    }

    @Override
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<RootEntity<Void>> deleteProduct(@PathVariable String id) {
        iProductService.deleteProduct(id);
        return noContent();
    }

    @Override
    @GetMapping("/recommendations")
    public ResponseEntity<RootEntity<List<ProductResponseDto>>> getRecommendationsForCurrentUser() {
        List<ProductResponseDto> recommendations=recommendationService.getRecommendationsForCurrentUser();
        return ok(recommendations);
    }
}
