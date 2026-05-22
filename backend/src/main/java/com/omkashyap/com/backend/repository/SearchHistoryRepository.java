package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.SearchHistory;
import com.omkashyap.com.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

  List<SearchHistory> findTop10ByUserOrderBySearchedAtDesc(User user);

  Optional<SearchHistory> findByUserAndSearchText(User user, String searchText);
}