package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffiliateUser {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      unique = true
  )
  private String affiliateCode;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "user_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_affiliate_user_user")
  )
  private User user;

  @OneToMany(
      mappedBy = "affiliateUser",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private List<AffiliateUserProduct> affiliateUserProducts = new ArrayList<>();

}
