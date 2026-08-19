package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.WishListItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishListItemRepository extends JpaRepository<WishListItem, Long> {

  List<WishListItem> findAllByWishListId(Long id);

  void deleteByWishListItemId(String wishListItemId);

  void deleteByProduct_ProductId(String productId);
}
