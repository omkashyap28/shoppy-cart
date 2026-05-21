package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.AffiliateUser;
import com.omkashyap.com.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AffiliateUserRepository extends JpaRepository<AffiliateUser, Long> {
  Optional<AffiliateUser> findByAffiliateCode(String affiliateCode);

  boolean existsByUser(User user);

  void deleteByAffiliateCode(String affiliateCode);
}