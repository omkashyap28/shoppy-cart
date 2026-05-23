package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.service.RecentViewedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/recent-viewed")
public class RecentViewedController {

  private final RecentViewedService recentViewedService;

  @PostMapping

  public ResponseEntity<Void> saveRecentViewed(
      @RequestHeader("Authorization") String authHeader,
      @RequestParam("productId") String productId
  ) {
    recentViewedService.saveRecentViewed(
        authHeader,
        productId
    );

    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @GetMapping
  public ResponseEntity<List<ProductResponseDto>>
  getRecentViewedProducts(
      @RequestParam("userId") String userId
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        recentViewedService.getRecentViewedProducts(userId)
    );
  }
}