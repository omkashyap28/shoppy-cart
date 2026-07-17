package com.omkashyap.com.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
    indexes = {
        @Index(name = "idx_product_productid", columnList = "product_id"),
        @Index(name = "idx_product_sellerid", columnList = "seller_id")
    },
    uniqueConstraints = @UniqueConstraint(name = "uk_product_productid", columnNames = "product_id")
)
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      length = 32
  )
  private String productId;

  @Column(
    nullable = false
  )
  private String brandName;

  @Column(
      nullable = false
  )
  private String description;

  @Column(
      nullable = false,
      unique = true
  )
  private String productThumbnail;

  @OneToMany(
      mappedBy = "product",
      orphanRemoval = true,
      cascade = CascadeType.ALL
  )
  @Builder.Default
  private List<ProductImage> productImages = new ArrayList<>();
  
  @OneToMany(
      mappedBy = "product",
      cascade = CascadeType.ALL,
      orphanRemoval = true
    )
    @Builder.Default
    private List<Review> review = new ArrayList<>();

  @JsonIgnore
  @ManyToOne(
      fetch = FetchType.EAGER
  )
  @JoinColumn(
      name = "seller_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_product_sellerid"
      )
  )
  private Seller seller;

  private Integer quantity;

  private Boolean inStock;

  private Integer totalReviews;

  private Float averageRating;

  private Float price;

  private Integer coins;

  private String productUrl;

  @Builder.Default
  private Integer returnCount = 0;

  @Builder.Default
  private Integer exchangeCount = 0;

  @Builder.Default
  private BigDecimal totalEarning = BigDecimal.valueOf(0);

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "category_id",
      foreignKey = @ForeignKey(
          name = "fk_product_categoryid"
      )
  )
  private Category category;

  @OneToMany(
      mappedBy = "product",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  @Builder.Default
  private List<ProductDiscussion> discussions = new ArrayList<>();

  @OneToMany(
      mappedBy = "product",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  @Builder.Default
  private List<ProductAttribute> productAttributes = new ArrayList<>();

  @OneToMany(
      mappedBy = "product",
      cascade = CascadeType.ALL,
      orphanRemoval = true
    )
  @Builder.Default
  private List<AffiliateUserProduct> affiliateUserProduct = new ArrayList<>();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "affiliate_commission_id",
      foreignKey = @ForeignKey(
          name = "fk_product_affiliate_commission"
      )
  )
  private AffiliateCommission affiliateCommission;


  @Builder.Default
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "product_tags",
      joinColumns = @JoinColumn(name = "product_id"),
      inverseJoinColumns = @JoinColumn(name = "tag_id")
  )
  private Set<Tags> tags = new HashSet<>();

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @PrePersist
  private void generateId() {
    if (this.productId == null) {
      this.productId = UUID.randomUUID().toString().replace("-", "");
    }
  }

  @PreUpdate
  void inStock() {
    if (this.quantity == 0) {
      this.inStock = false;
    }
  }

  @PostPersist
  void setPriceInCoins() {
    if (this.coins == null) {
      this.coins = price.intValue() * 2;
    }
  }

  public void assignSeller(Seller seller) {
    this.seller = seller;
  }

}
