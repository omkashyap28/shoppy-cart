package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;

import java.util.List;

public interface RecentViewedService {
  void saveRecentViewed(String authHeader, String productId);

  List<ProductResponseDto> getRecentViewedProducts(String userId);
}
