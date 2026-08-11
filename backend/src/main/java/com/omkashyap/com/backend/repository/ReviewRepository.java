package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.dto.projection.ReviewStatsProjection;
import com.omkashyap.com.backend.entity.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
  Boolean existsByUser_UserId(String userId);

  List<Review> findAllByProduct_ProductId(String productId, Pageable pageable);

  List<Review> findAllByUser_UserId(String userId);

  List<Review> findAllByProduct_ProductId(String productId, Long cursor, Pageable page);

  @Query(value = """
    SELECT
        p.product_id AS productId,

        COALESCE(ROUND(AVG(r.rating), 2), 0.0) AS averageRating,

        COUNT(r.id) AS totalReviews,

        COUNT(CASE WHEN r.rating = 5 THEN 1 END) AS fiveStar,
        COUNT(CASE WHEN r.rating = 4 THEN 1 END) AS fourStar,
        COUNT(CASE WHEN r.rating = 3 THEN 1 END) AS threeStar,
        COUNT(CASE WHEN r.rating = 2 THEN 1 END) AS twoStar,
        COUNT(CASE WHEN r.rating = 1 THEN 1 END) AS oneStar

    FROM product p

    LEFT JOIN review r
        ON r.product_id = p.id

    WHERE p.product_id = :productId

    GROUP BY p.product_id
    """,
    nativeQuery = true)
Optional<ReviewStatsProjection> findReviewStats(
    @Param("productId") String productId
);

  Optional<Review> findByUser_EmailAndProduct_ProductIdAndReviewId(String email, String productId, String reviewId);
}