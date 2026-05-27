package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.WishListRequestDto;
import com.omkashyap.com.backend.dto.responseDto.WishListResponseDto;
import com.omkashyap.com.backend.dtoMapper.WishListDtoMapper;
import com.omkashyap.com.backend.entity.*;
import com.omkashyap.com.backend.repository.*;
import com.omkashyap.com.backend.service.WishListService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishListServiceImpl implements WishListService {

  private final UserRepository userRepository;
  private final WishListRepository wishListRepository;
  private final ProductRepository productRepository;
  private final ProductAttributeRepository productAttributeRepository;
  private final WishListItemRepository wishListItemRepository;
  private final WishListDtoMapper wishListDtoMapper;

  @Override
  @Transactional
  public WishListResponseDto addProductToWishList(String userId, WishListRequestDto requestDto) {

    User user = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("User not exists"));
    Product product = productRepository.findByProductId(requestDto.getProductId()).orElseThrow(() ->
        new IllegalArgumentException("Product not exists")
    );
    WishList wishList = wishListRepository.findByUser_UserId(userId).orElseGet(() -> {
          WishList wishlist = WishList.builder()
              .user(user)
              .build();
          wishListRepository.save(wishlist);
          user.setWishList(wishlist);
          return wishlist;
        }
    );

    WishListItem wishListItem = WishListItem.builder()
        .wishList(wishList)
        .product(product)
        .build();

    if (wishList.getItems() == null) wishList.setItems(new ArrayList<>());

    if (requestDto.getSelectedAttributes() != null && !requestDto.getSelectedAttributes().isEmpty()) {
      List<ProductAttribute> productAttributes = product.getProductAttributes().stream()
          .filter(attr -> {
            String selectedValue = requestDto.getSelectedAttributes().get(attr.getAttributeName());
            productAttributeRepository.save(attr);
            return selectedValue != null && selectedValue.equals(attr.getAttributeValue());
          })
          .toList();
      wishListItem.setProductAttributes(productAttributes);
    }
    wishList.getItems().add(wishListItem);
    wishListItemRepository.save(wishListItem);

    return wishListDtoMapper.mapToDto(wishListItem);
  }

  @Override
  public List<WishListResponseDto> getWishListProducts(String userId) {

    WishList wishList = wishListRepository.findByUser_UserId(userId).orElseThrow(() ->
        new IllegalArgumentException("User not exists")
    );
    List<WishListItem> wishListItems = wishListItemRepository.findAllByWishListId(wishList.getId());

    return wishListItems.stream().map(wishListDtoMapper::mapToDto).toList();
  }

  @Override
  @Transactional
  public void removeProductFromWishlist(String wishlistId) {
    wishListItemRepository.deleteByWishListItemId(wishlistId);
  }

}
