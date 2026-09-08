package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.SearchRequestDto;
import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductsResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SearchHistoryResponseDto;

import java.util.List;

public interface SearchHistoryService {

  InfiniteScrollResponseDto<ProductsResponseDto> searchProduct(
      SearchRequestDto requestDto
  );

  List<SearchHistoryResponseDto> getRecentSearch(String userId);

  List<String> getTrendingSearches();

  List<String> autoCompleteSearch(String searchText);

  InfiniteScrollResponseDto<ProductResponseDto> searchProductByTags(
      String tag,
      Long lastProductId,
      int limit
  );

  List<ProductsResponseDto> getRelatedProducts(
      String productId,
      int limit
  );

  List<ProductsResponseDto> getTrendingProducts();

}
