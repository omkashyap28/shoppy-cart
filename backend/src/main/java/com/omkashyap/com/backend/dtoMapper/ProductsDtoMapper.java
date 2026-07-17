package com.omkashyap.com.backend.dtoMapper;

import com.omkashyap.com.backend.dto.responseDto.ProductsResponseDto;
import com.omkashyap.com.backend.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductsDtoMapper {

  public ProductsResponseDto mapToDto(Product product) {
    return ProductsResponseDto.builder()
        .productId(product.getProductId())
        .brandName(product.getBrandName())
        .description(product.getDescription())
        .productThumbnail(product.getProductThumbnail())
        .inStock(product.getInStock())
        .totalReviews(product.getTotalReviews())
        .averageRating(product.getAverageRating())
        .price(product.getPrice())
        .coins(product.getCoins())
        .productUrl(product.getProductUrl())
        .build();
  }

}
