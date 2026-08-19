package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.dto.projection.CartItemProjection;
import com.omkashyap.com.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @Query("""
        SELECT
            ci.cartItemId as cartItemId,
            ci.quantity as quantity,
            p.productId as productId,
            p.brandName as brandName,
            p.description as description,
            p.productThumbnail as productThumbnail,
            p.inStock as inStock,
            p.totalReviews as totalReviews,
            p.averageRating as averageRating,
            p.price as price,
            p.coins as coins,
            p.productUrl as productUrl
        FROM CartItem ci
        JOIN ci.cart c
        JOIN ci.product p
        WHERE c.user.userId = :userId
        ORDER BY ci.createdAt DESC
        """)
    List<CartItemProjection> findCartItems(String userId);

  void deleteByCartItemId(String cartItemId);

  Optional<CartItem> findByCartItemId(String cartId);

  List<CartItem> findAllByCart_Id(Long id);
}