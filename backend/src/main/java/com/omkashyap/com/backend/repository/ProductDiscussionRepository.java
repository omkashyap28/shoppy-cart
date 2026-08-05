package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.ProductDiscussion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductDiscussionRepository extends JpaRepository<ProductDiscussion, Long> {
  List<ProductDiscussion> findAllByProduct_ProductId(String productId, Pageable pageable);

  Optional<ProductDiscussion> findByDiscussionId(String discussionId);

  void deleteByDiscussionId(String discussionId);

  List<ProductDiscussion> findAllByParentId(Long id);

  List<ProductDiscussion> findAllByUser_Email(String email, Pageable pageable);

  List<ProductDiscussion> findAllByUser_EmailAndIdLessThan(String email, Long cursor, Pageable pageable);

  @Query(
      value = """
        SELECT *
        FROM product_discussion pd
        WHERE pd.product_id = :product
          AND pd.parent_id IS NULL
        ORDER BY pd.created_at DESC
        LIMIT :limit;
          """,
      nativeQuery = true
  )
  List<ProductDiscussion> findRandomLimitedByProduct(
      Long product,
      int limit
  );

  List<ProductDiscussion> findAllByProduct_ProductIdAndIdLessThan(String productId, Long cursor, Pageable pageable);
}