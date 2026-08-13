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
@Table(
    indexes = {
        @Index(name = "idx_product_attribute_productid", columnList = "product_id")
    }
)
public class ProductAttribute {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(
      fetch = FetchType.EAGER
  )
  @JoinColumn(
      name = "product_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_product_attribute_productid"
      )
  )
  private Product product;

  @Column(
      nullable = false,
      length = 100
  )
  private String attributeName;

  @Column(
      nullable = false,
      length = 255
  )
  private String attributeValue;

  @ManyToMany(
      mappedBy = "productAttributes"
  )
  @Builder.Default
  private List<CartItem> cart = new ArrayList<>();

}
