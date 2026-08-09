package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.ReviewRequestDto;
import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ReviewResponseDto;
import com.omkashyap.com.backend.dtoMapper.ReviewDtoMapper;
import com.omkashyap.com.backend.entity.*;
import com.omkashyap.com.backend.repository.ProductRepository;
import com.omkashyap.com.backend.repository.ReviewImageRepository;
import com.omkashyap.com.backend.repository.ReviewRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.service.ReviewService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

  private final ProductRepository productRepository;
  private final UserRepository userRepository;
  private final ReviewRepository reviewRepository;
  private final ReviewDtoMapper reviewDtoMapper;
  private final ReviewImageRepository reviewImageRepository;

  @Override
  @Transactional
  public ReviewResponseDto addReviewToProduct(String productId, ReviewRequestDto requestDto) {
    Product product = productRepository.findByProductId(productId).orElseThrow(() -> new IllegalArgumentException("Product not exists with this id" + productId));
    User user = userRepository.findByUserId(requestDto.getUserId()).orElseThrow(() -> new IllegalArgumentException("User not exists with this id" + requestDto.getUserId()));

    Boolean isExists = reviewRepository.existsByUser_UserId(requestDto.getUserId());

    if (isExists) {
      throw new RuntimeException("Review already exists by this user");
    }

    Review review = Review.builder()
        .user(user)
        .product(product)
        .message(requestDto.getMessage())
        .rating(requestDto.getRating())
        .build();

    reviewRepository.save(review);

    if (review.getReviewImages() == null) review.setReviewImages(new ArrayList<>());

    if (requestDto.getReviewImages() != null) {
      requestDto.getReviewImages().forEach(img -> {
        ReviewImage image = ReviewImage.builder()
            .imageId(img.getImageId())
            .thumbnailUrl(img.getThumbnailUrl())
            .imageUrl(img.getImageUrl())
            .review(review).build();

        reviewImageRepository.save(image);
        review.getReviewImages().add(image);
      });
    }

    product.setTotalReviews(product.getTotalReviews() + 1);
    product.getReview().add(review);
    user.getReviews().add(review);


    return reviewDtoMapper.mapToDto(review);
  }

  @Override
  public InfiniteScrollResponseDto<ReviewResponseDto> getAllProductReviewsByProductId(
      String productId,
      int limit,
      Long cursor
  ) {

    Pageable page = PageRequest.of(0, limit);

    List<Review> reviews;

    if (cursor == null) {
      reviews = reviewRepository.findAllByProduct_ProductId(
          productId,
          page);
    } else {
      reviews = reviewRepository.findAllByProduct_ProductId(
          productId,
          cursor,
          page);
    }

    List<ReviewResponseDto> responseDtos = reviews.stream()
        .map(reviewDtoMapper::mapToDto)
        .toList();

    Long nextCursor = reviews.isEmpty()
        ? null
        : reviews.getLast().getId();

    boolean hasMore = reviews.size() == limit;

    return InfiniteScrollResponseDto.<ReviewResponseDto>builder()
        .content(responseDtos)
        .nextCursor(nextCursor)
        .hasMore(hasMore)
        .build();
  }

  @Override
  public void deleteReviewByProductAndReviewId(String productId, String reviewId) {
    boolean isExists = productRepository.existsByProductId(productId);
    if (!isExists) throw new IllegalArgumentException("Product not exists");

    Review review = reviewRepository.findByReviewId(reviewId).orElseThrow(() -> new IllegalArgumentException("Product not exists with this id" + productId));

    reviewRepository.deleteById(review.getId());
  }

  @Override
  public List<ReviewResponseDto> getAllReviewsByUserId(String userId) {
    List<Review> reviews = reviewRepository.findAllByUser_UserId(userId);

    return reviews.stream()
        .map(reviewDtoMapper::mapToDto)
        .toList();
  }

}
