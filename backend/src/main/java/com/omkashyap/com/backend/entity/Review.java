package com.omkashyap.com.backend.entity;

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
        @Index(name = "idx_review_userid", columnList = "user_id"),
    },
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_review_productuserid", columnNames = {"user_id", "product_id"}
        ),
        @UniqueConstraint(
            name = "uk_review_reviewid", columnNames = "review_id"
        )
    }
)
public class Review {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      length = 32
  )
  private String reviewId;

  @ManyToOne(
      fetch = FetchType.EAGER
  )
  @JoinColumn(
      nullable = false,
      name = "product_id",
      foreignKey = @ForeignKey(
          name = "fk_review_productid"
      )
  )
  private Product product;

  @ManyToOne(
      fetch = FetchType.EAGER
  )
  @JoinColumn(
      nullable = false,
      name = "user_id",
      foreignKey = @ForeignKey(
          name = "fk_review_userid"
      )
  )
  private User user;

  @Column(
      nullable = false
  )
  private Integer rating;

  @Column(
      nullable = false,
      length = 200
  )
  private String message;

  @Builder.Default
  private Boolean edited = false;

  @OneToMany(
      mappedBy = "review",
      orphanRemoval = true,
      cascade = CascadeType.ALL
  )
  @Builder.Default
  private List<ReviewImage> reviewImages = new ArrayList<>();

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @PrePersist
  void generateId() {
    if (this.reviewId == null) {
      this.reviewId = UUID.randomUUID().toString().replace("-", "");
    }
  }

}
