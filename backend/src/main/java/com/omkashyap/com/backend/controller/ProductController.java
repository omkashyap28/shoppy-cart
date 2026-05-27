package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.OrderRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ReviewRequestDto;
import com.omkashyap.com.backend.dto.responseDto.OrderResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ReviewResponseDto;
import com.omkashyap.com.backend.service.OrderService;
import com.omkashyap.com.backend.service.ProductService;
import com.omkashyap.com.backend.service.ReviewService;
import com.omkashyap.com.backend.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/product/{productId}")
public class ProductController {

  private final ProductService productService;
  private final ReviewService reviewService;
  private final OrderService orderService;
  private final SearchHistoryService searchHistoryService;

  @GetMapping
  ResponseEntity<ProductResponseDto> getProductById(@PathVariable String productId, @RequestParam(required = false) String refId) {
    return ResponseEntity.status(HttpStatus.OK).body(productService.getProductById(productId, refId));
  }

  @PostMapping("/reviews")
  ResponseEntity<ReviewResponseDto> addReviewToProduct(@PathVariable String productId, @RequestBody ReviewRequestDto requestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.addReviewToProduct(productId, requestDto));
  }

  @GetMapping("/reviews")
  ResponseEntity<List<ReviewResponseDto>> getAllProductReviewsByProductId(@PathVariable String productId) {
    return ResponseEntity.status(HttpStatus.OK).body(reviewService.getAllProductReviewsByProductId(productId));
  }

  @DeleteMapping("/reviews")
  ResponseEntity<Void> deleteReviewById(@PathVariable String productId, @RequestParam String reviewId) {
    reviewService.deleteReviewByProductAndReviewId(productId, reviewId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/order")
  ResponseEntity<OrderResponseDto> placeNewOrder(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable String productId,
      @RequestParam(required = false) String refId,
      @RequestBody OrderRequestDto requestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(
        orderService.placeNewOrder(authHeader, productId, refId, requestDto)
    );
  }


  @GetMapping("/related")
  ResponseEntity<List<ProductResponseDto>> getRelatedProductsByTag(
      @PathVariable String productId,
      @RequestParam(required = false, defaultValue = "10") int limit
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        searchHistoryService.getRelatedProducts(productId, limit)
    );
  }

}
