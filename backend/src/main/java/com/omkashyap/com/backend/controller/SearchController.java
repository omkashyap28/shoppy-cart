package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SearchHistoryResponseDto;
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

  @GetMapping
  ResponseEntity<InfiniteScrollResponseDto<ProductResponseDto>> searchProduct(
      @RequestParam String query,

      @RequestParam(required = false)
      Long lastProductId,

      @RequestParam(defaultValue = "10")
      int limit,

      @RequestParam(required = false) String userId
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        searchHistoryService.searchProduct(
            query, userId, limit, lastProductId
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

}
