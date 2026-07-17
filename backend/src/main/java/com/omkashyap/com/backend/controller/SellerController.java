package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.AddressRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ProductRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SellerAccountRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SellerVerificationRequestDto;
import com.omkashyap.com.backend.dto.responseDto.*;
import com.omkashyap.com.backend.service.ProductService;
import com.omkashyap.com.backend.service.ReviewService;
import com.omkashyap.com.backend.service.SellerService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import jakarta.servlet.http.Cookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/seller/{sellerId}")
public class SellerController {

  private final SellerService sellerService;
  private final ProductService productService;
  private final ReviewService reviewService;

  @GetMapping
  ResponseEntity<SellerResponseDto> getSellerBySellerId(@PathVariable("sellerId") String sellerId) {
    return ResponseEntity.status(HttpStatus.OK).body(sellerService.getSellerBySellerId(sellerId));
  }

  @PostMapping("/address")
  ResponseEntity<ShopAddressResponseDto> addShopAddressBySellerId(@PathVariable String sellerId, @Valid @RequestBody AddressRequestDto addressRequestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(sellerService.addAddressBySellerId(sellerId, addressRequestDto));
  }

  @GetMapping("/address")
  ResponseEntity<ShopAddressResponseDto> getShopAddressBySellerId(@PathVariable String sellerId) {
    return ResponseEntity.status(HttpStatus.OK).body(sellerService.getSellerAddressBySellerId(sellerId));
  }

  @PatchMapping
  ResponseEntity<SellerResponseDto> updatePartialSellerDetail(@PathVariable String sellerId, @Valid @RequestBody Map<String, Object> updates) {
    return ResponseEntity.status(HttpStatus.OK).body(sellerService.updatePartialSellerDetails(sellerId, updates));
  }

  @PostMapping("/verification")
  ResponseEntity<SellerResponseDto> addSellerVerification(
    @PathVariable String sellerId,
    HttpServletResponse response,
    @Valid @RequestBody SellerVerificationRequestDto requestDto) {

      Cookie hasSellerAccountCookie = new Cookie("hasSellerAccount", "true");
      hasSellerAccountCookie.setSecure(false);
      hasSellerAccountCookie.setHttpOnly(true);
      hasSellerAccountCookie.setMaxAge(7 * 24 * 60 * 60);
      hasSellerAccountCookie.setPath("/");

      response.addCookie(hasSellerAccountCookie);

    return ResponseEntity.status(HttpStatus.CREATED).body(sellerService.addSellerVerification(sellerId, requestDto));
  }

  @PostMapping("/account-verification")
  ResponseEntity<SellerResponseDto> addSellerAccountInfo(@PathVariable String sellerId, @Valid @RequestBody SellerAccountRequestDto requestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(sellerService.addSellerAccountInfo(sellerId, requestDto));
  }

  @DeleteMapping
  ResponseEntity<Void> deleteSeller(@PathVariable String sellerId) {
    sellerService.deleteSellerById(sellerId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/products")
  ResponseEntity<ProductResponseDto> createProduct(@PathVariable String sellerId, @Valid @RequestBody ProductRequestDto productRequestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(productService.addNewProduct(sellerId, productRequestDto));
  }

  @GetMapping("/products/{productId}")
  ResponseEntity<ProductResponseDto> getProduct(@PathVariable String sellerId, @PathVariable String productId) {
    return ResponseEntity.status(HttpStatus.CREATED).body(productService.getProductBySellerAndProductId(sellerId, productId));
  }

  @PatchMapping("/products/{productId}")
  ResponseEntity<ProductResponseDto> updatePartialProductById(@PathVariable String sellerId, @PathVariable String productId, @RequestBody Map<String, Object> values) {
    return ResponseEntity.status(HttpStatus.OK).body(productService.patchProductById(sellerId, productId, values));
  }

  @GetMapping("/products")
  ResponseEntity<List<ProductsResponseDto>> getAllProduct(@PathVariable String sellerId) {
    return ResponseEntity.status(HttpStatus.OK).body(productService.getAllProducts(sellerId));
  }

  @DeleteMapping("/products/{productId}")
  ResponseEntity<Void> deleteProduct(@PathVariable String sellerId, @PathVariable String productId) {
    productService.deleteProductBySellerId(sellerId, productId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/products/{productId}/reviews")
  ResponseEntity<List<ReviewResponseDto>> getAllReviewsBySellerId(@PathVariable String productId) {
    return ResponseEntity.status(HttpStatus.OK).body(reviewService.getAllProductReviewsByProductId(productId));
  }

}
