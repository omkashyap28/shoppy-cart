package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.projection.CartItemProjection;
import com.omkashyap.com.backend.dto.requestDto.CartRequestDto;
import com.omkashyap.com.backend.dto.requestDto.CartUpdateRequestDto;
import com.omkashyap.com.backend.dto.responseDto.CartItemResponseDto;
import com.omkashyap.com.backend.dto.responseDto.CartResponseDto;
import com.omkashyap.com.backend.entity.*;
import com.omkashyap.com.backend.repository.*;
import com.omkashyap.com.backend.service.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

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

    List<CartItemProjection> items = cartItemRepository.findCartItems(userId);

    if (items.isEmpty()) {
      return List.of();
    }

    return items.stream().map(
        item -> CartItemResponseDto.builder()
            .cartItemId(item.getCartItemId())
            .productId(item.getProductId())
            .brandName(item.getBrandName())
            .description(item.getDescription())
            .productThumbnail(item.getProductThumbnail())
            .inStock(item.getInStock())
            .totalReviews(item.getTotalReviews())
            .averageRating(item.getAverageRating())
            .price(item.getPrice())
            .coins(item.getCoins())
            .productUrl(item.getProductUrl())
            .quantity(item.getQuantity())
            .build()
    ).toList();
  }

  @Override
  @Transactional
  public void removeCartItemFromCartById(String cartItemId) {
    cartItemRepository.deleteByCartItemId(cartItemId);
  }

  @Override
  public CartItemResponseDto patchCartByCartId(String cartItemId, CartUpdateRequestDto cartUpdateRequestDto) {
    CartItem cartItem = cartItemRepository.findByCartItemId(cartItemId).orElseThrow(() ->
        new IllegalArgumentException("Invalid cartId")
    );

    cartItem.setQuantity(cartUpdateRequestDto.getQuantity());
    cartItemRepository.save(cartItem);

    return CartItemResponseDto.builder()
        .cartItemId(cartItem.getCartItemId())
        .productId(cartItem.getProduct().getProductId())
        .brandName(cartItem.getProduct().getBrandName())
        .description(cartItem.getProduct().getDescription())
        .productThumbnail(cartItem.getProduct().getProductThumbnail())
        .inStock(cartItem.getProduct().getInStock())
        .totalReviews(cartItem.getProduct().getTotalReviews())
        .averageRating(cartItem.getProduct().getAverageRating())
        .price(cartItem.getProduct().getPrice())
        .coins(cartItem.getProduct().getCoins())
        .productUrl(cartItem.getProduct().getProductUrl())
        .quantity(cartItem.getQuantity())
        .build();
  }

}
