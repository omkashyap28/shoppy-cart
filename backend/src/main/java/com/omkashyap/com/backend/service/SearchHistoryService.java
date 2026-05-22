package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SearchHistoryResponseDto;

import java.util.List;

public interface SearchHistoryService {

  InfiniteScrollResponseDto<ProductResponseDto> searchProduct(
      String searchText,
      String userId,
      int limit,
      Long lastProductId
  );

  List<SearchHistoryResponseDto> getRecentSearch(String userId);

  List<String> getTrendingSearches();

  List<String> autoCompleteSearch(String searchText);
}
