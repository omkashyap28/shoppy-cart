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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(
    uniqueConstraints = @UniqueConstraint(
        name = "uk_order_item_order_item_id", columnNames = "order_item_id"
    ),
    indexes = @Index(
        name = "idx_order_item_order_item_id", columnList = "order_item_id"
    )
)
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      length = 38
  )
  private String orderItemId;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "order_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_order_item_orderid"
      )
  )
  private Orders order;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "product_id",
      foreignKey = @ForeignKey(
          name = "fk_order_item_product_id"
      )
  )
  private Product product;

  @OneToOne(
      mappedBy = "orderItem",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private Payment payments;

  @OneToOne(
      cascade = CascadeType.ALL,
      mappedBy = "orderItem",
      orphanRemoval = true
  )
  private Invoice invoice;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "address_id",
      foreignKey = @ForeignKey(
          name = "fk_order_item_address_id"
      )
  )
  private Address address;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "order_item_product_attributes",

      joinColumns = @JoinColumn(
          name = "order_item_pk",
          referencedColumnName = "id",
          foreignKey = @ForeignKey(
              name = "fk_order_item_attr_order_item"
          )
      ),

      inverseJoinColumns = @JoinColumn(
          name = "product_attribute_pk",
          referencedColumnName = "id",
          foreignKey = @ForeignKey(
              name = "fk_order_item_attr_product_attribute"
          )
      )
  )
  @Builder.Default
  private List<ProductAttribute> productAttributes = new ArrayList<>();

  private Double amount;

  @Column(
      nullable = false
  )
  private Integer quantity;

  @OneToOne(
      cascade = CascadeType.ALL,
      mappedBy = "orderItem",
      orphanRemoval = true
  )
  private OrderStatus status;

  @CreationTimestamp
  @Column(
      updatable = false
  )
  private LocalDateTime createdAt;

  @PrePersist
  void generateId() {
    if (this.orderItemId == null) {
      this.orderItemId = "order_" + UUID.randomUUID().toString().replace("-", "");
    }
  }

}
