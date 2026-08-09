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
    indexes = {
        @Index(
            name = "idx_review_image_reviewid", columnList = "review_id"
        )
    },
    uniqueConstraints = @UniqueConstraint(
        name = "uk_review_imageurl", columnNames = "image_url"
    )
)
public class ReviewImage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(
      fetch = FetchType.EAGER
  )
  @JoinColumn(
      name = "review_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_review_image_reviewid"
      )

  )
  private Review review;

  @Column(
      nullable = false,
      unique = true,
      updatable = false
  )
  private String imageId;

  @Column(
      nullable = false,
      unique = true
  )
  private String thumbnailUrl;

  @Column(
      unique = true,
      nullable = false
  )
  private String imageUrl;

}
