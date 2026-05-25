package com.omkashyap.com.backend.dto.responseDto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class ProductResponseDto {

  private String productId;
  private String description;
  private List<String> productImages;
  private Map<String, String> productAttributes;
  private String sellerId;
  private Boolean inStock;
  private Integer totalReviews;
  private Float averageRating;
  private Long categoryId;
  private Float price;
  private Integer coins;
  private String productUrl;

}
