package com.omeracar.eshop.service;

import com.omeracar.eshop.dto.product.ProductResponseDto;

import java.util.List;

public interface IRecommendationService {

    List<ProductResponseDto> getRecommendationsForCurrentUser();
}
