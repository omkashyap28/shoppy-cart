package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.AffiliateUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AffiliateUserRepository extends JpaRepository<AffiliateUser, Long> {
  Optional<AffiliateUser> findByAffiliateCode(String affiliateCode);

  boolean existsByUser_Email(String email);

  Optional<AffiliateUser> findByUser_UserId(String userId);

  void deleteByAffiliateCode(String affiliateCode);
}