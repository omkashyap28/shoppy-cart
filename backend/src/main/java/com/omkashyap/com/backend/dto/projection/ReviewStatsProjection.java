package com.omkashyap.com.backend.dto.projection;

public interface ReviewStatsProjection {

  String getProductId();

  Double getAverageRating();

  Integer getTotalReviews();

  Integer getFiveStar();

  Integer getFourStar();

  Integer getThreeStar();

  Integer getTwoStar();

  Integer getOneStar();
}