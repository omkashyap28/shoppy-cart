package com.omkashyap.com.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.omkashyap.com.backend.type.CategoryEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
    indexes = {
        @Index(name = "idx_seller_userid", columnList = "user_id"),
        @Index(name = "idx_seller_sellerid", columnList = "seller_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_seller_sellerid", columnNames = "seller_id")
    }
)
public class Seller {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      updatable = false,
      length = 32
  )
  private String sellerId;

  @Column(
      nullable = false,
      length = 100
  )
  private String shopName;

  @Column(
      length = 200
  )
  private String description;

  private Float averageRating;

  private Integer ratingCount;

  @Enumerated(EnumType.STRING)
  @Column(
      nullable = false
  )
  private CategoryEnum category;

  @JsonIgnore
  @OneToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "user_id",
      nullable = false
  )
  private User user;

  @JsonIgnore
  @OneToMany(
      orphanRemoval = true,
      mappedBy = "seller",
      cascade = CascadeType.ALL
  )
  @Builder.Default
  private List<Product> products = new ArrayList<>();

  @JsonIgnore
  @OneToOne(
      mappedBy = "seller",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private SellerVerification sellerVerification;

  @OneToOne(
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      mappedBy = "seller"
  )
  private SellerBank sellerBank;

  @JsonIgnore
  @OneToOne(
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      mappedBy = "seller"
  )
  private ShopAddress shopAddress;

  private Boolean isVerified;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @PrePersist
  private void createSellerId() {
    if (this.sellerId == null) {
      this.sellerId = UUID.randomUUID().toString().replace("-", "");
    }
  }

  public void addProduct(Product product) {
    products.add(product);
    product.assignSeller(this);
  }
}
