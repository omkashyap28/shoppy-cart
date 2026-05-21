package com.omkashyap.com.backend.config;

import com.omkashyap.com.backend.entity.AffiliateCommission;
import com.omkashyap.com.backend.repository.AffiliateCommissionRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AffiliateCommissionInitializer
    implements CommandLineRunner {

  private final AffiliateCommissionRepository repository;

  @Override
  public void run(String @NonNull ... args) {

    if (repository.count() > 0) {
      return;
    }

    List<AffiliateCommission> commissions = List.of(

        AffiliateCommission.builder()
            .categoryName("APPAREL")
            .commissionPercentage(new BigDecimal("10"))
            .active(true)
            .build(),

        AffiliateCommission.builder()
            .categoryName("BEAUTY")
            .commissionPercentage(new BigDecimal("10"))
            .active(true)
            .build(),

        AffiliateCommission.builder()
            .categoryName("KITCHEN")
            .commissionPercentage(new BigDecimal("5"))
            .active(true)
            .build(),

        AffiliateCommission.builder()
            .categoryName("ELECTRONICS")
            .commissionPercentage(new BigDecimal("3.5"))
            .active(true)
            .build(),

        AffiliateCommission.builder()
            .categoryName("MOBILES")
            .commissionPercentage(new BigDecimal("1"))
            .active(true)
            .build(),

        AffiliateCommission.builder()
            .categoryName("LAPTOPS")
            .commissionPercentage(new BigDecimal("1"))
            .active(true)
            .build(),

        AffiliateCommission.builder()
            .categoryName("BOOKS")
            .commissionPercentage(new BigDecimal("5"))
            .active(true)
            .build(),

        AffiliateCommission.builder()
            .categoryName("FURNITURE")
            .commissionPercentage(new BigDecimal("0.8"))
            .active(true)
            .build(),

        AffiliateCommission.builder()
            .categoryName("FASHION")
            .commissionPercentage(new BigDecimal("4"))
            .active(true)
            .build()
    );

    repository.saveAll(commissions);
  }
}
