package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
    name = "affiliate_commissions",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = "category_name"
        )
    }
)
public class AffiliateCommission {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String categoryName;

  @Column(
      nullable = false,
      precision = 5,
      scale = 2
  )
  private BigDecimal commissionPercentage;

  @Column(nullable = false)
  private Boolean active = true;
}
