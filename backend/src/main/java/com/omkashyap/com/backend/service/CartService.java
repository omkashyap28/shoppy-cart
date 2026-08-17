package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.CartRequestDto;
import com.omkashyap.com.backend.dto.requestDto.CartUpdateRequestDto;
import com.omkashyap.com.backend.dto.responseDto.CartItemResponseDto;
import com.omkashyap.com.backend.dto.responseDto.CartResponseDto;

import java.util.List;

public interface CartService {
  CartResponseDto addToCart(String userId, CartRequestDto requestDto);

  List<CartItemResponseDto> getCartItemsFromCart(String userId);

  void removeCartItemFromCartById(String cartItemId);

  CartItemResponseDto patchCartByCartId(String cartItemId, CartUpdateRequestDto cartUpdateRequestDto);
}
