package com.omkashyap.com.backend.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductsResponseDto {
  private String productId;
  private String brandName;
  private String description;
  private String productThumbnail;
  private Boolean inStock;
  private Integer totalReviews;
  private Double averageRating;
  private Float price;
  private Integer coins;
  private String productUrl;
}
