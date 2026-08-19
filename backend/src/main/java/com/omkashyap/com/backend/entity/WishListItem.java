package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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
    indexes = @Index(
        name = "idx_wishlist_item_id", columnList = "wish_list_item_id"
    ),
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_wishlist_item_id", columnNames = {"wishlist_id", "product_id"}
        )
    }
)
public class WishListItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false
  )
  private String wishListItemId;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "wishlist_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_wishlist_item_wishlistid"
      )
  )
  private WishList wishList;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "product_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_wishlist_item_productid"
      )
  )
  private Product product;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "wishlist_item_product_attributes",

      joinColumns = @JoinColumn(
          name = "wishlist_item_pk",
          referencedColumnName = "id",
          foreignKey = @ForeignKey(
              name = "fk_wishlist_item_attr_wishlist_item"
          )
      ),

      inverseJoinColumns = @JoinColumn(
          name = "product_attribute_pk",
          referencedColumnName = "id",
          foreignKey = @ForeignKey(
              name = "fk_wishlist_item_attr_product_attribute"
          )
      )
  )
  @Builder.Default
  private List<ProductAttribute> productAttributes = new ArrayList<>();

  @PrePersist
  private void generateId() {
    if (this.wishListItemId == null) {
      this.wishListItemId = UUID.randomUUID().toString().replace("-", "");
    }
  }
}
