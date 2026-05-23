package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.RecentViewed;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RecentViewedRepository extends JpaRepository<RecentViewed, Long> {

  Optional<RecentViewed> findByUser_EmailAndProduct_ProductId(String email, String productId);

  List<RecentViewed> findTop20ByUser_UserIdOrderByViewedAtDesc(String userId);

  @Modifying
  @Transactional
  @Query(
      value = """
          DELETE FROM recent_viewed
          WHERE id NOT IN (
              SELECT id
              FROM (
                  SELECT rv.id
                  FROM recent_viewed rv
                  INNER JOIN users u
                      ON rv.user_id = u.id
                  WHERE u.user_id = :userId
                  ORDER BY rv.viewed_at DESC
                  LIMIT 20
              ) temp
          )
          AND user_id IN (
              SELECT id
              FROM users
              WHERE user_id = :userId
          )
          """,
      nativeQuery = true
  )
  void deleteOldRecentViewed(
      @Param("userId") String userId
  );
}