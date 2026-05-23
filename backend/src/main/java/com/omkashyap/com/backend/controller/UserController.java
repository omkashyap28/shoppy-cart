package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.AddressRequestDto;
import com.omkashyap.com.backend.dto.requestDto.CartRequestDto;
import com.omkashyap.com.backend.dto.requestDto.WishListRequestDto;
import com.omkashyap.com.backend.dto.responseDto.*;
import com.omkashyap.com.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/{userId}")
public class UserController {

  private final UserService userService;
  private final ReviewService reviewService;
  private final CartService cartService;
  private final WishListService wishListService;
  private final ProductDiscussionService productDiscussionService;

  @GetMapping
  ResponseEntity<UserResponseDto> getUserById(@PathVariable("userId") String userId) {
    return ResponseEntity.status(HttpStatus.OK).body(userService.getUserById(userId));
  }

  @PatchMapping
  ResponseEntity<UserResponseDto> updatePartialUserDetail(@PathVariable String userId, @RequestBody Map<String, Object> updates) {
    return ResponseEntity.status(HttpStatus.OK).body(userService.updatePartialUserDetails(userId, updates));
  }

  @DeleteMapping
  ResponseEntity<Void> deleteUserByUserId(@PathVariable String userId) {
    userService.deleteUserById(userId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/address")
  ResponseEntity<UserResponseDto> createAddressByUserId(@PathVariable String userId, @RequestBody AddressRequestDto addressRequestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(userService.addAddressToUser(userId, addressRequestDto));
  }

  @GetMapping("/address")
  ResponseEntity<List<AllAddressResponseDto>> getAddressByUserId(@PathVariable String userId) {
    return ResponseEntity.status(HttpStatus.OK).body(userService.getAllAddressByUserId(userId));
  }

  @GetMapping("/all-reviews")
  ResponseEntity<List<ReviewResponseDto>> getAllReviewByUserId(@PathVariable String userId) {
    return ResponseEntity.status(HttpStatus.OK).body(reviewService.getAllReviewsByUserId(userId));
  }

  @PostMapping("/cart")
  ResponseEntity<CartResponseDto> addToCart(@PathVariable String userId, @RequestBody CartRequestDto requestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(cartService.addToCart(userId, requestDto));
  }

  @GetMapping("/cart")
  ResponseEntity<List<CartItemResponseDto>> getCartItemsFromCart(@PathVariable String userId) {
    return ResponseEntity.status(HttpStatus.CREATED).body(cartService.getCartItemsFromCart(userId));
  }

  @DeleteMapping("/cart/{cartItemId}")
  ResponseEntity<Void> removeCartItemFromCartById(@PathVariable String cartItemId) {
    cartService.removeCartItemFromCartById(cartItemId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/wishlists")
  ResponseEntity<WishListResponseDto> addProductToWishList(@PathVariable String userId, @RequestBody WishListRequestDto requestDto) {
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(wishListService.addProductToWishList(userId, requestDto));
  }

  @GetMapping("/wishlists")
  ResponseEntity<List<WishListResponseDto>> getWishListProducts(@PathVariable String userId) {
    return ResponseEntity.status(HttpStatus.OK).body(wishListService.getWishListProducts(userId));
  }

  @DeleteMapping("/wishlists/{wishlistId}")
  ResponseEntity<Void> removeProductFromWishlist(@PathVariable String wishlistId) {
    wishListService.removeProductFromWishlist(wishlistId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/discussions")
  ResponseEntity<InfiniteScrollResponseDto<ProductDiscussionResponseDto>> getProductDiscussionsByUser(
      @RequestHeader("Authorization") String authHeader,
      @RequestParam(required = false) Long cursor,
      @RequestParam(defaultValue = "10") int size
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        productDiscussionService.getAllDiscussionByUser(authHeader, cursor, size)
    );
  }
}