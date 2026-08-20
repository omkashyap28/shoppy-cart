package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.projection.ReviewStatsProjection;
import com.omkashyap.com.backend.dto.requestDto.ReviewRequestDto;
import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ReviewImageResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ReviewResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ReviewStatsResponseDto;
import com.omkashyap.com.backend.dtoMapper.ReviewDtoMapper;
import com.omkashyap.com.backend.entity.Product;
import com.omkashyap.com.backend.entity.Review;
import com.omkashyap.com.backend.entity.ReviewImage;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.ProductRepository;
import com.omkashyap.com.backend.repository.ReviewImageRepository;
import com.omkashyap.com.backend.repository.ReviewRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.service.ReviewService;
import com.omkashyap.com.backend.util.AuthHeaderUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

  private final ProductRepository productRepository;
  private final UserRepository userRepository;
  private final ReviewRepository reviewRepository;
  private final ReviewDtoMapper reviewDtoMapper;
  private final ReviewImageRepository reviewImageRepository;
  private final AuthHeaderUtil authHeaderUtil;

  @Override
  @Transactional
  public ReviewResponseDto addReviewToProduct(String productId, ReviewRequestDto requestDto) {
    Product product = productRepository.findByProductId(productId)
        .orElseThrow(() -> new IllegalArgumentException("Product not exists with this id" + productId));
    User user = userRepository.findByUserId(requestDto.getUserId())
        .orElseThrow(() -> new IllegalArgumentException("User not exists with this id" + requestDto.getUserId()));

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

    if (review.getReviewImages() == null)
      review.setReviewImages(new ArrayList<>());

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

    double average = product.getReview().stream()
        .map(Review::getRating)
        .filter(Objects::nonNull)
        .mapToDouble(Number::doubleValue)
        .average()
        .orElse(0.0F);

    product.setTotalReviews(product.getTotalReviews() + 1);
    product.setAverageRating(average);
    product.getReview().add(review);
    user.getReviews().add(review);

    return reviewDtoMapper.mapToDto(review);
  }

  @Override
  public InfiniteScrollResponseDto<ReviewResponseDto> getAllProductReviewsByProductId(
      String productId,
      int limit,
      Long cursor) {

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
  @Transactional
  public void deleteReviewByProductAndReviewId(String authHeader, String productId, String reviewId) {
    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);

    Review review = reviewRepository.findByUser_EmailAndProduct_ProductIdAndReviewId(email, productId, reviewId).orElseThrow(() ->
        new IllegalArgumentException("Review not exists with this id")
    );

    if (!review.getReviewImages().isEmpty()) {
      review.getReviewImages().forEach(reviewImage -> {
        reviewImageRepository.delete(reviewImage);
      });
    }

    review.getProduct().setTotalReviews(review.getProduct().getTotalReviews() - 1);

    reviewRepository.delete(review);
  }

  @Override
  public List<ReviewResponseDto> getAllReviewsByUserId(String userId) {
    List<Review> reviews = reviewRepository.findAllByUser_UserId(userId);

    return reviews.stream()
        .map(reviewDtoMapper::mapToDto)
        .toList();
  }

  @Override
  public ReviewStatsResponseDto getProductReviewStats(String productId) {

    Optional<ReviewStatsProjection> reviewStats = reviewRepository.findReviewStats(productId);

    if (reviewStats.isEmpty()) {
      Map<String, Integer> emptyDiscussion = new LinkedHashMap<>();
      emptyDiscussion.put("5", 0);
      emptyDiscussion.put("4", 0);
      emptyDiscussion.put("3", 0);
      emptyDiscussion.put("2", 0);
      emptyDiscussion.put("1", 0);

      return ReviewStatsResponseDto.builder()
          .productId(productId)
          .averageRating(0.0)
          .totalReviews(0)
          .ratingDistribution(emptyDiscussion)
          .build();
    }

    ReviewStatsProjection stats = reviewStats.get();

    Map<String, Integer> distribution = new LinkedHashMap<>();
    distribution.put("5", stats.getFiveStar());
    distribution.put("4", stats.getFourStar());
    distribution.put("3", stats.getThreeStar());
    distribution.put("2", stats.getTwoStar());
    distribution.put("1", stats.getOneStar());

    return ReviewStatsResponseDto.builder()
        .productId(productId)
        .averageRating(stats.getAverageRating())
        .totalReviews(stats.getTotalReviews())
        .ratingDistribution(distribution)
        .build();
  }

  @Override
  public InfiniteScrollResponseDto<ReviewImageResponseDto> getAllReviewsImagesByProductId(
      String productId,
      int limit,
      Long cursor
  ) {
    Pageable page = PageRequest.of(0, Math.min(limit, 20));

    Page<ReviewImage> reviewImages;

    if (cursor == null) {
      reviewImages = reviewImageRepository.findInitialReviewImages(productId, page);
    } else {
      reviewImages = reviewImageRepository.findReviewImagesAfterCursor(productId, cursor, page);
    }

    List<ReviewImageResponseDto> responsesDto = reviewImages.stream().map(
        item -> ReviewImageResponseDto.builder()
            .imageId(item.getImageId())
            .thumbnailUrl(item.getThumbnailUrl())
            .imageUrl(item.getImageUrl())
            .build()
    ).toList();

    System.out.println(responsesDto);

    boolean hasMore = reviewImages.hasNext();

    Long nextCursor = reviewImages.isEmpty() ? null : reviewImages.getContent().getLast().getId();

    return InfiniteScrollResponseDto.<ReviewImageResponseDto>builder()
        .content(responsesDto)
        .nextCursor(nextCursor)
        .hasMore(hasMore)
        .build();
  }

}
