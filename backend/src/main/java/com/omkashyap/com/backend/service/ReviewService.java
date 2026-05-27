package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.ReviewRequestDto;
import com.omkashyap.com.backend.dto.responseDto.ReviewResponseDto;

import java.util.List;

public interface ReviewService {
  ReviewResponseDto addReviewToProduct(String productId, ReviewRequestDto requestDto);

  List<ReviewResponseDto> getAllProductReviewsByProductId(String productId);

  void deleteReviewByProductAndReviewId(String productId, String reviewId);

  List<ReviewResponseDto> getAllReviewsByUserId(String userId);
}

