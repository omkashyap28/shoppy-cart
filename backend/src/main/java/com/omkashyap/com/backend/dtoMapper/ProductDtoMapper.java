package com.omkashyap.com.backend.dtoMapper;

import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.entity.AffiliateUserProduct;
import com.omkashyap.com.backend.entity.Product;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ProductDtoMapper {

  public ProductResponseDto mapToDto(Product product) {
    ProductResponseDto dto = new ProductResponseDto();

    dto.setProductId(product.getProductId());
    dto.setDescription(product.getDescription());
    dto.setSellerId(product.getSeller().getSellerId());
    dto.setInStock(product.getInStock());
    dto.setTotalReviews(product.getTotalReviews());
    dto.setAverageRating(product.getAverageRating());
    dto.setPrice(product.getPrice());
    dto.setCoins(product.getCoins());
    dto.setProductUrl(product.getProductUrl());
    dto.setCategoryId(product.getCategory().getId());

    List<String> images = new ArrayList<>();
    if (product.getProductImages() != null && !product.getProductImages().isEmpty()) {
      product.getProductImages()
          .forEach(img -> images.add(img.getImageUrl()));
      dto.setProductImages(images);
    }

    Map<String, String> attributes = new HashMap<>();
    if (product.getProductAttributes() != null) {
      product.getProductAttributes()
          .forEach(attr -> attributes.put(
              attr.getAttributeName(),
              attr.getAttributeValue()
          ));
      dto.setProductAttributes(attributes);

    }

    return dto;

  }

  public ProductResponseDto mapToDto(AffiliateUserProduct affiliateUserProduct) {
    Product product = affiliateUserProduct.getProduct();

    ProductResponseDto dto = new ProductResponseDto();
    dto.setProductId(product.getProductId());
    dto.setDescription(product.getDescription());
    dto.setSellerId(product.getSeller().getSellerId());
    dto.setInStock(product.getInStock());
    dto.setTotalReviews(product.getTotalReviews());
    dto.setAverageRating(product.getAverageRating());
    dto.setPrice(product.getPrice());
    dto.setCoins(product.getCoins());
    dto.setProductUrl(affiliateUserProduct.getAffiliateLink());

    if (product.getCategory() != null) {
      dto.setCategoryId(product.getCategory().getId());
    }

    List<String> images = new ArrayList<>();
    if (product.getProductImages() != null && !product.getProductImages().isEmpty()) {
      product.getProductImages()
          .forEach(img -> images.add(img.getImageUrl()));
      dto.setProductImages(images);
    }

    Map<String, String> attributes = new HashMap<>();
    if (product.getProductAttributes() != null) {
      product.getProductAttributes()
          .forEach(attr -> attributes.put(
              attr.getAttributeName(),
              attr.getAttributeValue()
          ));
      dto.setProductAttributes(attributes);

    }

    return dto;

  }
}
