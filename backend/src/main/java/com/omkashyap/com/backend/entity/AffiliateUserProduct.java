package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
    name = "affiliate_user_products",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"affiliate_user_id", "product_id"}
        )
    }
)
@Builder
public class AffiliateUserProduct {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(
      name = "affiliate_user_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_affiliate_user_product_affiliate_user"
      )
  )
  private AffiliateUser affiliateUser;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(
      name = "product_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_affiliate_user_product_product"
      )
  )
  private Product product;

  @Column(
      nullable = false,
      precision = 5,
      scale = 2
  )
  private BigDecimal commissionPercentage;

  @Column(nullable = false)
  @Builder.Default
  private Long totalClicks = 0L;

  @Column(nullable = false)
  @Builder.Default
  private Long totalConversions = 0L;

  @Column(
      nullable = false,
      precision = 12,
      scale = 2
  )
  @Builder.Default
  private BigDecimal totalEarnings = BigDecimal.ZERO;

  @Column(nullable = false, unique = true)
  private String affiliateLink;

  public void increaseClick() {
    this.totalClicks++;
  }

  public void increaseConversion() {
    this.totalConversions++;
  }

  public void addEarnings(BigDecimal amount) {
    this.totalEarnings = this.totalEarnings.add(amount);
  }
}