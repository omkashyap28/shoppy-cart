package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.ReviewImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewImageRepository extends JpaRepository<ReviewImage, Long> {
  List<ReviewImage> findAllByReview_Id(Long id);

  Page<ReviewImage> findAllByReview_Product_ProductId(
      @Param("productId") String productId,
      Pageable pageable
  );

  @Query("""
    SELECT ri
    FROM ReviewImage ri
    WHERE ri.review.product.productId = :productId
""")
  Page<ReviewImage> findInitialReviewImages(
      @Param("productId") String productId,
      Pageable pageable
  );

  @Query("""
          SELECT ri
          FROM ReviewImage ri
          WHERE ri.review.product.productId = :productId
            AND ri.id < :cursor
          ORDER BY ri.id DESC
      """)
  Page<ReviewImage> findReviewImagesAfterCursor(
      @Param("productId") String productId,
      @Param("cursor") Long cursor,
      Pageable pageable
  );
}