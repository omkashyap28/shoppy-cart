package com.omkashyap.com.backend.dto.projection;

public interface CartItemProjection {

  String getCartItemId();

  String getProductId();

  String getBrandName();

  String getDescription();

  String getProductThumbnail();

  Boolean getInStock();

  Integer getTotalReviews();

  Double getAverageRating();

  Float getPrice();

  Integer getCoins();

  String getProductUrl();

  Integer getQuantity();
}