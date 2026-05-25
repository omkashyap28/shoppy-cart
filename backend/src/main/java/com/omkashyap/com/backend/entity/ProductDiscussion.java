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
        @Index(name = "idx_discussion_userid", columnList = "user_id"),
        @Index(name = "idx_discussion_productid", columnList = "product_id"),
        @Index(name = "idx_discussion_id", columnList = "discussion_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_product_discussion", columnNames = {"user_id", "product_id"}
        )
    }
)
public class ProductDiscussion {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      length = 32,
      unique = true
  )
  private String discussionId;

  @Column(nullable = false, length = 255)
  private String message;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "user_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_product_discussion_userid"
      )
  )
  private User user;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "product_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_product_discussion_productid"
      )
  )
  private Product product;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "parent_id",
      foreignKey = @ForeignKey(
          name = "fk_prodcut_discussion_parentid"
      )
  )
  private ProductDiscussion parent;

  @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<ProductDiscussion> replies = new ArrayList<>();

  @OneToMany(
      mappedBy = "discussions",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  @Builder.Default
  private List<DiscussionLike> likes = new ArrayList<>();

  @Builder.Default
  private Boolean edited = false;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @PrePersist
  void generateId() {
    if (this.discussionId == null) {
      this.discussionId = UUID.randomUUID().toString().replace("-", "");
    }
  }
}