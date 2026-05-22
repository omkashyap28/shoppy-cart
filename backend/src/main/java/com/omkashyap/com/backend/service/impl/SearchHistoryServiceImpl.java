package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SearchHistoryResponseDto;
import com.omkashyap.com.backend.dtoMapper.ProductDtoMapper;
import com.omkashyap.com.backend.entity.Product;
import com.omkashyap.com.backend.entity.SearchHistory;
import com.omkashyap.com.backend.entity.SearchSuggestion;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.ProductRepository;
import com.omkashyap.com.backend.repository.SearchHistoryRepository;
import com.omkashyap.com.backend.repository.SearchSuggestionRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
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
  private final SearchSuggestionRepository searchSuggestionRepository;


  @Override
  public InfiniteScrollResponseDto<ProductResponseDto> searchProduct(
      String searchText,
      String userId,
      int limit,
      Long lastProductId
  ) {
    searchText = searchText.trim().toLowerCase();

    Pageable pageable = PageRequest.of(0, limit);
    List<Product> products;

    if (lastProductId == null) {
      products = productRepository.findByDescriptionContainingIgnoreCaseOrderByIdDesc(
          searchText,
          pageable
      );
    } else {
      products = productRepository.findByDescriptionContainingIgnoreCaseAndIdLessThanOrderByIdDesc(
          searchText,
          lastProductId,
          pageable
      );
    }

//    Save search history
    String finalSearchText = searchText;
    if (userId != null && !userId.isBlank()) {
      User user = userRepository.findByUserId(userId).orElseThrow(() ->
          new IllegalArgumentException("User not exists"));

      SearchHistory searchHistory = searchHistoryRepository.findByUserAndSearchText(user, searchText).orElseGet(() -> {
        SearchHistory search = SearchHistory.builder()
            .user(user)
            .searchText(finalSearchText)
            .build();
        return searchHistoryRepository.save(search);
      });
      searchHistory.incrementSearch();
      searchHistoryRepository.save(searchHistory);
    }

//    Save search analytics
    SearchSuggestion searchSuggestion = searchSuggestionRepository.findByKeyword(searchText).orElseGet(() -> {
      SearchSuggestion suggestion = SearchSuggestion.builder()
          .keyword(finalSearchText)
          .build();
      return searchSuggestionRepository.save(suggestion);
    });
    searchSuggestion.incrementTotalSearches();
    searchSuggestionRepository.save(searchSuggestion);

    List<ProductResponseDto> productResponseDtos = products.stream()
        .map(productDtoMapper::mapToDto)
        .toList();

    Long nextCursor = null;

    if (!products.isEmpty()) {
      nextCursor = products.getLast().getId();
    }

    return InfiniteScrollResponseDto.<ProductResponseDto>builder()
        .content(productResponseDtos)
        .nextCursor(nextCursor)
        .hasMore(products.size() == limit)
        .build();
  }

  @Override
  public List<SearchHistoryResponseDto> getRecentSearch(String userId) {
    User user = userRepository.findByUserId(userId).orElseThrow(() ->
        new IllegalArgumentException("User not exists"));

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
}
