package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

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
    uniqueConstraints = @UniqueConstraint(
        name = "uk_cart_unique_key", columnNames = {"cart_id", "product_id", "cart_item_pk"}
    )
)
public class CartItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      length = 32,
      updatable = false
  )
  private String cartItemId;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "cart_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_cart_item_cartid"
      )
  )
  private Cart cart;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "product_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_cart_item_productid"
      )
  )
  private Product product;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "cart_item_product_attributes",

      joinColumns = @JoinColumn(
          name = "cart_item_pk",
          referencedColumnName = "id",
          foreignKey = @ForeignKey(
              name = "fk_cart_item_attr_cart_item"
          )
      ),

      inverseJoinColumns = @JoinColumn(
          name = "product_attribute_pk",
          referencedColumnName = "id",
          foreignKey = @ForeignKey(
              name = "fk_cart_item_attr_product_attribute"
          )
      )
  )
  @Builder.Default
  private List<ProductAttribute> productAttributes = new ArrayList<>();

  @Column(
      nullable = false
  )
  private Integer quantity;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @PrePersist
  private void generateId() {
    if (this.cartItemId == null) {
      this.cartItemId = UUID.randomUUID().toString().replace("-", "");
    }
  }

}
