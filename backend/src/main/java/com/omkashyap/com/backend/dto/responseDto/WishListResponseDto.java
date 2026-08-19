package com.omkashyap.com.backend.dto.responseDto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class WishListResponseDto {

  private String wishlistId;
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
  private Map<String, String> productAttributes;

}
