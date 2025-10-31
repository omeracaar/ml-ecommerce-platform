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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements IRecommendationService {

    private static final Logger logger= LoggerFactory.getLogger(RecommendationServiceImpl.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ProductRepository productRepository;

    //!!
    @Value("${recommendation.api.url:http://localhost:5000/recommend}")
    private String recommendationApiUrl;

    private static final String DEMO_KAGGLE_USER_ID="C17270";

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
        logger.info("demo kullanici id'si: '{} icin oneriler getiriliyor",DEMO_KAGGLE_USER_ID);

        List<String> recommendedProductIds=null;
        ResponseEntity<List<String>> response=null;
        try {
            String url=recommendationApiUrl + "?user_id=" + DEMO_KAGGLE_USER_ID;
            logger.info("python ml api a istek atiliyor: {}",url);

            response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<String>>() {}
            );
            logger.info("ml api cevabi alindi status: {}",response.getStatusCode());

            if (response.getStatusCode().is2xxSuccessful()){
                recommendedProductIds=response.getBody();
                if (recommendedProductIds!=null){
                    logger.info("ml api den alinan body (id listesi) {} ",recommendedProductIds);
                if (recommendedProductIds.isEmpty()){
                    logger.info("ml api bos oneri listesi dondurdu");
                    return Collections.emptyList();
                }
                }else {
                    logger.info("ml api den 2xx status alindi ama response body null geldi");
                    return Collections.emptyList();
                }
            }else {
                logger.info("ml apisinden basarisiz status code alindi: {}. Body: {}",response.getStatusCode(),response.getBody());
                return Collections.emptyList();
            }
        }catch (RestClientException e){
            String responseBodyLog = "Alınamadı";
            if (e.getCause() instanceof org.springframework.web.client.HttpClientErrorException ex){responseBodyLog=ex.getResponseBodyAsString();}
            else if (e.getCause() instanceof org.springframework.web.client.HttpServerErrorException ex) { responseBodyLog = ex.getResponseBodyAsString();}
            logger.info("ML API'sine bağlanırken veya cevap işlenirken hata oluştu: {} - Dönen Body: {}", e.getMessage(), responseBodyLog, e);
            return Collections.emptyList();
        }catch (Exception e){
            logger.info("Öneriler getirilirken beklenmedik bir hata oluştu!",e);
            return Collections.emptyList();
        }

        logger.info("Alınan ID'ler DB'de filtrelenecek: {}", recommendedProductIds);
        List<Product> foundProducts = productRepository.findAllById(recommendedProductIds);
        logger.info("db de bulunan {} adet urun bilgisi cekildi",foundProducts.size());
        if (foundProducts.isEmpty()){
            logger.info("ML API'sinin önerdiği ID'lerden HİÇBİRİ veritabanında bulunamadı!");
            return Collections.emptyList();
        }

        Map<String,Product> productMap=foundProducts.stream()
                .collect(Collectors.toMap(Product::getId,product -> product));

        List<ProductResponseDto> productResponseDto=recommendedProductIds.stream()
                .map(productMap::get)
                .filter(product -> product !=null)
                .map(this::convertProductToDto)
                .collect(Collectors.toList());

        logger.info("'{}' icin {} adet filtrenmis ve siralanmis oneri bulundu",DEMO_KAGGLE_USER_ID,productResponseDto.size());
        return productResponseDto;
    }
}
