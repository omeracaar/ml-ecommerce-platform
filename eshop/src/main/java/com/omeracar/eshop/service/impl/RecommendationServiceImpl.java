package com.omeracar.eshop.service.impl;

import com.omeracar.eshop.dto.product.ProductResponseDto;
import com.omeracar.eshop.model.Category;
import com.omeracar.eshop.model.Product;
import com.omeracar.eshop.repository.ProductRepository;
import com.omeracar.eshop.service.IRecommendationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements IRecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationServiceImpl.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ProductRepository productRepository;

    @Value("${recommendation.api.url:http://localhost:5000/recommend}")
    private String recommendationApiUrl;


    private static final String GUEST_MODE_ID = "C17603";


    private static final String LOGGED_IN_MODE_ID = "C17270";

    @Transactional(readOnly = true)
    protected ProductResponseDto convertProductToDto(Product product){
        if (product == null) return null;
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setImageUrl(product.getImageUrl());
        Category category = product.getCategory();
        if (category != null) {
            dto.setCategoryName(category.getName());
            dto.setCategoryId(category.getId());
        }
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getRecommendationsForCurrentUser() {

        String userIdToSend;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isLoggedIn = authentication != null &&
                authentication.isAuthenticated() &&
                !"anonymousUser".equals(authentication.getPrincipal());

        if (isLoggedIn) {
            // Kullanıcı giriş yapmış
            String currentUsername = authentication.getName();
            logger.info("Kullanıcı GİRİŞ YAPMIŞ: {}. ML Modeli için '{}' ID'si kullanılacak.", currentUsername, LOGGED_IN_MODE_ID);
            userIdToSend = LOGGED_IN_MODE_ID;
        } else {
            // Misafir kullanıcı
            logger.info("Kullanıcı MİSAFİR. ML Modeli için '{}' ID'si kullanılacak.", GUEST_MODE_ID);
            userIdToSend = GUEST_MODE_ID;
        }

        List<String> recommendedProductIds = null;
        try {
            String url = recommendationApiUrl + "?user_id=" + userIdToSend;
            logger.info("Python ML API isteği: {}", url);

            ResponseEntity<List<String>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<String>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null){
                recommendedProductIds = response.getBody();
            } else {
                return Collections.emptyList();
            }
        } catch (Exception e){
            logger.error("ML API Hatası: {}", e.getMessage());
            return Collections.emptyList();
        }

        if (recommendedProductIds == null || recommendedProductIds.isEmpty()) {
            logger.warn("UYARI: Python API boş liste döndürdü!");
            return Collections.emptyList();
        }

        logger.info("1. Python ML Modeli {} adet ID önerdi.", recommendedProductIds.size());
        logger.info("2. Python'dan gelen ID Listesi: {}", recommendedProductIds);

        List<Product> foundProducts = productRepository.findAllById(recommendedProductIds);

        logger.info("3. Bu ID'lerden veritabanında bulunan ürün sayısı: {}", foundProducts.size());

        if (foundProducts.size() < recommendedProductIds.size()) {
            logger.warn("Python {} ürün önerdi ama DB de sadece {} tanesi bulundu.",
                    recommendedProductIds.size(), foundProducts.size());

            // Veritabanında OLMAYANLARI görmek için:
            List<String> foundIds = foundProducts.stream().map(Product::getId).toList();
            logger.info("DB'de BULUNAN ID'ler: {}", foundIds);
        }
        Map<String,Product> productMap = foundProducts.stream()
                .collect(Collectors.toMap(Product::getId, product -> product));

        return recommendedProductIds.stream()
                .map(productMap::get)
                .filter(java.util.Objects::nonNull)
                .map(this::convertProductToDto)
                .collect(Collectors.toList());
    }
}