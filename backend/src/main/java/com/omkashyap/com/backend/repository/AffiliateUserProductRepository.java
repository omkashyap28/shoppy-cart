package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.AffiliateUserProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AffiliateUserProductRepository extends JpaRepository<AffiliateUserProduct, Long> {

  List<AffiliateUserProduct> findAllByAffiliateUser_AffiliateCode(String affiliateCode);

  Optional<AffiliateUserProduct> findByAffiliateUser_AffiliateCodeAndProduct_ProductId(
      String affiliateCode, String productId
  );

  void deleteByAffiliateUser_AffiliateCodeAndProduct_ProductId(String affiliateCode, String productId);
}
