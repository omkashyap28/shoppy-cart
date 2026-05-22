package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.SearchSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.util.Optional;

public interface SearchSuggestionRepository extends JpaRepository<SearchSuggestion, Long> {
  Optional<SearchSuggestion> findByKeyword(String searchText);

  List<SearchSuggestion> findTop10ByKeywordStartingWithIgnoreCaseOrderByTotalSearchesDesc(String keyword);

  List<SearchSuggestion> findTop10ByOrderByTotalSearchesDesc();
}