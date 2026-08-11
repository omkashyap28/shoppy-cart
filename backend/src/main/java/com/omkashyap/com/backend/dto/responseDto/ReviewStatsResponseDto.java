package com.omkashyap.com.backend.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewStatsResponseDto {

  private String productId;
  private Double averageRating;
  private Integer totalReviews;
  private Map<String, Integer> ratingDistribution;

}
