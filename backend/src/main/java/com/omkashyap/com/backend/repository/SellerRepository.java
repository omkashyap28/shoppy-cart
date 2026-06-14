package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SellerRepository extends JpaRepository<Seller, Long> {

  Optional<Seller> findBySellerId(String sellerId);

  Optional<Seller> findByUser_UserId(String userId);

  Boolean existsBySellerId(String sellerId);

  void deleteBySellerId(String sellerId);

  boolean existsByUser_Email(String email);
}