package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Tags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagsRepository extends JpaRepository<Tags, Long> {
  Optional<Tags> findByTagName(String tag);

  boolean existsByTagName(String tag);
}