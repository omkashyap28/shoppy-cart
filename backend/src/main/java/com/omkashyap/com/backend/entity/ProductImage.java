package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
    uniqueConstraints = @UniqueConstraint(
        name = "uk_product_image_producturl", columnNames = "product_url"
    )
)
public class ProductImage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(
      fetch = FetchType.EAGER
  )
  @JoinColumn(
      name = "product_id",
      foreignKey = @ForeignKey(name = "fk_product_image_productid")
  )
  private Product product;

  @Column(
      nullable = false
  )
  private String imageUrl;

  @Column(
    nullable = false
  )
  private String thumbnailUrl;

  @Column(
    nullable = false,
    unique = true
  )
  private String imageId;

  @Column(
    nullable = false
  )
  private Boolean isThumbnail;

  @Column(
    nullable = false
  )
  private Integer priority;

  @Column
  private String altText;
}
