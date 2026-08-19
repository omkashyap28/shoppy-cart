package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.WishListProductExistenceCheckRequestDto;
import com.omkashyap.com.backend.dto.requestDto.WishListRequestDto;
import com.omkashyap.com.backend.dto.responseDto.WishListProductExistenceCheckResponseDto;
import com.omkashyap.com.backend.dto.responseDto.WishListResponseDto;

import java.util.List;

public interface WishListService {
  WishListResponseDto addProductToWishList(String userId, WishListRequestDto requestDto);

  List<WishListResponseDto> getWishListProducts(String userId);

  void removeProductFromWishlist(String wishListId);

  WishListProductExistenceCheckResponseDto checkProductExistenceInWishlist(String userId, WishListProductExistenceCheckRequestDto requestDto);
}
