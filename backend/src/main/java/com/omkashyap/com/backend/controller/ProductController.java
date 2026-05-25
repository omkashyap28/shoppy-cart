package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.ReviewRequestDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ReviewResponseDto;
import com.omkashyap.com.backend.service.ProductService;
import com.omkashyap.com.backend.service.ReviewService;
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

  @GetMapping
  ResponseEntity<ProductResponseDto> getProductById(@PathVariable String productId) {
    return ResponseEntity.status(HttpStatus.OK).body(productService.getProductById(productId));
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

}
