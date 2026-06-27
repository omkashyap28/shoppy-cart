package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.CartRequestDto;
import com.omkashyap.com.backend.dto.responseDto.CartItemResponseDto;
import com.omkashyap.com.backend.dto.responseDto.CartResponseDto;
import com.omkashyap.com.backend.entity.*;
import com.omkashyap.com.backend.repository.*;
import com.omkashyap.com.backend.service.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

  private final UserRepository userRepository;
  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;
  private final ProductRepository productRepository;
  private final ProductAttributeRepository productAttributeRepository;

  @Override
  @Transactional
  public CartResponseDto addToCart(String userId, CartRequestDto requestDto) {
    User user = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("User not exists"));
    Product product = productRepository.findByProductId(requestDto.getProductId()).orElseThrow(() ->
        new IllegalArgumentException("Product not exists")
    );
    Cart cart = cartRepository.findByUser_UserId(userId).orElseGet(() -> {
      Cart newCart = Cart.builder()
          .user(user)
          .build();
      return cartRepository.save(newCart);
    });

    CartItem cartItem = CartItem.builder()
        .cart(cart)
        .product(product)
        .quantity(requestDto.getQuantity())
        .build();

    if (requestDto.getSelectedAttributes() != null && !requestDto.getSelectedAttributes().isEmpty()) {
      List<ProductAttribute> matchedAttributes = product.getProductAttributes().stream()
          .filter(attr -> {
            String selectedValue = requestDto.getSelectedAttributes().get(attr.getAttributeName());
            productAttributeRepository.save(attr);
            return selectedValue != null && selectedValue.equals(attr.getAttributeValue());
          }).toList();

      cartItem.setProductAttributes(matchedAttributes);
    }
    cart.getCartItem().add(cartItem);
    cartItemRepository.save(cartItem);

    return CartResponseDto.builder()
        .quantity(cart.getCartItem().size())
        .createdAt(cart.getCreatedAt())
        .build();

  }

  @Override
  public List<CartItemResponseDto> getCartItemsFromCart(String userId) {
    Cart cart = cartRepository.findByUser_UserId(userId).orElse(null);

    if(cart == null) {
      return new ArrayList<>();
    }

    List<CartItem> cartItems = cartItemRepository.findAllByCartId(cart.getId());

    return cartItems.stream()
        .map(item -> {
          CartItemResponseDto dto = new CartItemResponseDto();
          dto.setCartItemId(item.getCartItemId());
          dto.setQuantity(item.getQuantity());
          dto.setProductId(item.getProduct().getProductId());
          dto.setProductUrl(item.getProduct().getProductUrl());
          Map<String, String> attributes = new HashMap<>();
          item.getProductAttributes()
              .forEach(attr -> attributes.put(attr.getAttributeName(), attr.getAttributeValue()));
          dto.setProductAttributes(attributes);

          return dto;
        }).toList();
  }

  @Override
  @Transactional
  public void removeCartItemFromCartById(String cartItemId) {
    cartItemRepository.deleteByCartItemId(cartItemId);
  }

}
