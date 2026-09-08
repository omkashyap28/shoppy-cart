package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.SearchRequestDto;
import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductsResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SearchHistoryResponseDto;
import com.omkashyap.com.backend.dtoMapper.ProductDtoMapper;
import com.omkashyap.com.backend.dtoMapper.ProductsDtoMapper;
import com.omkashyap.com.backend.entity.*;
import com.omkashyap.com.backend.repository.ProductRepository;
import com.omkashyap.com.backend.repository.SearchHistoryRepository;
import com.omkashyap.com.backend.repository.SearchSuggestionRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchHistoryServiceImpl implements SearchHistoryService {

  private final ProductRepository productRepository;
  private final UserRepository userRepository;
  private final SearchHistoryRepository searchHistoryRepository;
  private final ProductDtoMapper productDtoMapper;
  private final ProductsDtoMapper productsDtoMapper;
  private final SearchSuggestionRepository searchSuggestionRepository;

  @Override
  public InfiniteScrollResponseDto<ProductsResponseDto> searchProduct(
      SearchRequestDto requestDto) {

    String query = requestDto.getQuery().trim();
    query = query.isBlank() ? null : query;

    int limit = requestDto.getLimit() == null ? 20 : requestDto.getLimit();

    Pageable pageable = PageRequest.of(0, Math.min(limit, 50));

    Page<Product> products = productRepository.searchProduct(
        query,
        requestDto.getMinPrice(),
        requestDto.getMaxPrice(),
        requestDto.getRating(),
        requestDto.getInStock(),
        pageable
    );

    // Save search history
    if (requestDto.getUserId() != null && !requestDto.getUserId().isBlank()) {
      User user = userRepository.findByUserId(requestDto.getUserId())
          .orElse(null);

      String finalQuery = query;
      SearchHistory searchHistory = searchHistoryRepository.findByUserAndSearchText(user, query).orElseGet(() -> {
        SearchHistory search = SearchHistory.builder()
            .user(user)
            .searchText(finalQuery)
            .build();
        return searchHistoryRepository.save(search);
      });
      searchHistory.incrementSearch();
      searchHistoryRepository.save(searchHistory);
    }

    // Save search analytics
    SearchSuggestion searchSuggestion = searchSuggestionRepository.findByKeyword(requestDto.getQuery()).orElseGet(() -> {
      SearchSuggestion suggestion = SearchSuggestion.builder()
          .keyword(requestDto.getQuery())
          .build();
      return searchSuggestionRepository.save(suggestion);
    });
    searchSuggestion.incrementTotalSearches();
    searchSuggestionRepository.save(searchSuggestion);

    List<ProductsResponseDto> productResponseDtos = products.stream()
        .map(productsDtoMapper::mapToDto)
        .toList();

    Long nextCursor = null;

    if(products.hasNext()) {
      nextCursor = products.getContent().getLast().getId();
    }

    return InfiniteScrollResponseDto.<ProductsResponseDto>builder()
        .content(productResponseDtos)
        .nextCursor(nextCursor)
        .hasMore(products.hasNext())
        .build();
  }

  @Override
  public List<SearchHistoryResponseDto> getRecentSearch(String userId) {
    User user = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("User not exists"));

    return searchHistoryRepository
        .findTop10ByUserOrderBySearchedAtDesc(user)
        .stream()
        .map(history -> SearchHistoryResponseDto.builder()
            .searchText(history.getSearchText())
            .searchedAt(history.getSearchedAt())
            .searchId(history.getSearchId())
            .build())
        .toList();
  }

  @Override
  public List<String> getTrendingSearches() {
    return searchSuggestionRepository
        .findTop10ByOrderByTotalSearchesDesc()
        .stream()
        .map(SearchSuggestion::getKeyword)
        .toList();
  }

  @Override
  public List<String> autoCompleteSearch(String searchText) {
    return searchSuggestionRepository
        .findTop10ByKeywordStartingWithIgnoreCaseOrderByTotalSearchesDesc(searchText)
        .stream()
        .map(SearchSuggestion::getKeyword)
        .toList();
  }

  @Override
  public InfiniteScrollResponseDto<ProductResponseDto> searchProductByTags(
      String slug,
      Long lastProductId,
      int limit) {
    Pageable pageable = PageRequest.of(0, Math.min(limit, 10));

    List<Product> products;

    if (lastProductId == null) {
      products = productRepository.findByTags_SlugIgnoreCaseOrderByIdDesc(
          slug,
          pageable);
    } else {
      products = productRepository.findByTags_SlugIgnoreCaseAndIdLessThanOrderByIdDesc(
          slug,
          lastProductId,
          pageable);
    }

    List<ProductResponseDto> responseDtos = products.stream()
        .map(productDtoMapper::mapToDto)
        .toList();
    Long nextCursor = products.isEmpty()
        ? null
        : products.getLast().getId();

    boolean hasMore = products.size() == limit;
    return InfiniteScrollResponseDto.<ProductResponseDto>builder()
        .content(responseDtos)
        .nextCursor(nextCursor)
        .hasMore(hasMore)
        .build();
  }

  @Override
  public List<ProductsResponseDto> getRelatedProducts(
      String productId,
      int limit) {

    Product product = productRepository.findByProductId(productId)
        .orElseThrow(() -> new RuntimeException("Product not found"));

    List<String> tags = product.getTags()
        .stream()
        .map(Tags::getSlug)
        .toList();

    List<Product> relatedProducts = productRepository
        .findRandomRelatedProducts(
            productId,
            tags,
            Math.min(limit, 20));

    return relatedProducts.stream()
        .map(productsDtoMapper::mapToDto)
        .toList();
  }

  public List<ProductsResponseDto> getTrendingProducts() {
    Pageable page = PageRequest.of(0, 20);
    List<Product> products = productRepository.findTopNProducts(page);

    return products.stream().map(productsDtoMapper::mapToDto).toList();
  }
}
