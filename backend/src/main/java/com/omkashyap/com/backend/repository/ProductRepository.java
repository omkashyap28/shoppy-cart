package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Product;
import com.omkashyap.com.backend.entity.Seller;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
  Optional<Product> findByProductId(String productId);

  Optional<Product> findByProductIdAndSeller_SellerId(String productId, String sellerId); 

  List<Product> findAllBySeller(Seller seller);

  Boolean existsByProductId(String productId);

  List<Product> findByDescriptionContainingIgnoreCaseAndIdLessThanOrderByIdDesc(
      String searchText,
      Long lastProductId,
      Pageable pageable
  );

  List<Product> findByDescriptionContainingIgnoreCaseOrderByIdDesc(
      String searchText,
      Pageable pageable
  );

  List<Product> findByTags_SlugIgnoreCaseOrderByIdDesc(String tag, Pageable pageable);

  List<Product> findByTags_SlugIgnoreCaseAndIdLessThanOrderByIdDesc(
      String tag,
      Long lastProductId,
      Pageable pageable
  );

  @Query(
      value = """
          SELECT DISTINCT p.*
          FROM product p
          INNER JOIN product_tags pt
              ON p.id = pt.product_id
          INNER JOIN tags t
              ON t.id = pt.tag_id
          WHERE t.slug IN (:tags)
          AND p.id != :productId
          ORDER BY RAND()
          LIMIT :limit
          """,
      nativeQuery = true
  )
  List<Product> findRandomRelatedProducts(
      @Param("productId") String productId,
      @Param("tags") List<String> tags,
      @Param("limit") int limit
  );

  @Query(value = """
    SELECT *
    FROM product
    ORDER BY id DESC
    """, nativeQuery = true)
  List<Product> findTopNProducts(@Param("limit") Pageable limit);

  @Query(value = """
    SELECT *
    FROM product
    WHERE id < :lastProductId
    ORDER BY id DESC
    """, nativeQuery = true)
  List<Product> findTopNProductsAfterId(
      @Param("lastProductId") Long lastProductId,
      @Param("limit") Pageable limit
  );
}