package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.AffiliateCommission;
import com.omkashyap.com.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.OptionalDouble;

public interface AffiliateCommissionRepository extends JpaRepository<AffiliateCommission, Long> {
  Optional<AffiliateCommission> findByCategoryName(String name);
}
