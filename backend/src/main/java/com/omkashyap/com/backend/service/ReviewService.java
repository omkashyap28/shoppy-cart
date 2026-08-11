package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.ReviewRequestDto;
import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ReviewResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ReviewStatsResponseDto;

import java.util.List;

public interface ReviewService {
  ReviewResponseDto addReviewToProduct(String productId, ReviewRequestDto requestDto);

  InfiniteScrollResponseDto<ReviewResponseDto> getAllProductReviewsByProductId(
      String productId,
      int size,
      Long cursor
  );

  void deleteReviewByProductAndReviewId(String authHeader, String productId, String reviewId);

  List<ReviewResponseDto> getAllReviewsByUserId(String userId);

  ReviewStatsResponseDto getProductReviewStats(String productId);
}

