package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
  Boolean existsByUser_UserId(String userId);

  List<Review> findAllByProduct_ProductId(String productId, Pageable pageable);

  List<Review> findAllByUser_UserId(String userId);

  Optional<Review> findByReviewId(String reviewId);

  List<Review> findAllByProduct_ProductId(String productId, Long cursor, Pageable page);
}