package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.SearchRequestDto;
import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductsResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SearchHistoryResponseDto;
import com.omkashyap.com.backend.service.ProductService;
import com.omkashyap.com.backend.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class SearchController {

  private final SearchHistoryService searchHistoryService;
  private final ProductService productService;

  @GetMapping
  ResponseEntity<InfiniteScrollResponseDto<ProductsResponseDto>> searchProduct(
      @ModelAttribute SearchRequestDto requestDto
      ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        searchHistoryService.searchProduct(
            requestDto
        )
    );
  }

  @GetMapping("/tags")
  ResponseEntity<InfiniteScrollResponseDto<ProductResponseDto>> searchProductByTags(
      @RequestParam String slug,
      @RequestParam(required = false)
      Long lastProductId,

      @RequestParam(defaultValue = "10")
      int limit
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        searchHistoryService.searchProductByTags(
            slug, lastProductId, limit
        )
    );
  }

  @GetMapping("/recent/{userId}")
  ResponseEntity<List<SearchHistoryResponseDto>> getRecentSearches(@PathVariable String userId) {
    return ResponseEntity.status(HttpStatus.OK).body(
        searchHistoryService.getRecentSearch(userId)
    );
  }

  @GetMapping("/trending")
  ResponseEntity<List<String>> getTrendingSearches() {
    return ResponseEntity.ok(
        searchHistoryService.getTrendingSearches()
    );
  }

  @GetMapping("/autocomplete")
  ResponseEntity<List<String>> autoCompleteSearch(@RequestParam String keyword) {
    return ResponseEntity.status(HttpStatus.OK).body(
        searchHistoryService.autoCompleteSearch(keyword)
    );
  }

  @GetMapping("/initial")
  ResponseEntity<InfiniteScrollResponseDto<ProductsResponseDto>> getInitialProducts(
    @RequestParam(required = false, defaultValue = "20") int limit,
    @RequestParam(required = false) Long lastProductId
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        productService.getInitialProducts(limit, lastProductId)
    );
  }

  @GetMapping("/trendings/products")
  ResponseEntity<List<ProductsResponseDto>> getTrendingProducts() {
    return ResponseEntity.status(HttpStatus.OK).body(
      searchHistoryService.getTrendingProducts()
    );
  }

}
