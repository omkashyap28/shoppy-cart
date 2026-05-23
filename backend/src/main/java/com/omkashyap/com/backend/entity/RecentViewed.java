package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(
    indexes = {
        @Index(name = "idx_recent_user", columnList = "user_id"),
        @Index(name = "idx_recent_viewedAt", columnList = "viewedAt")
    }
)
public class RecentViewed {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "user_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_viewed_userid"
      )
  )
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "product_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_recent_attributes"
      )
  )
  private Product product;

  private LocalDateTime viewedAt;

  @PrePersist
  public void onCreated() {
    this.viewedAt = LocalDateTime.now();
  }

  public void updateViewedAtTimeStamp() {
    this.viewedAt = LocalDateTime.now();
  }
}
