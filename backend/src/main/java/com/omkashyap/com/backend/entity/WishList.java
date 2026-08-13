package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
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
        @Index(name = "idx_wish_list_userid", columnList = "user_id")
    },
    uniqueConstraints = @UniqueConstraint(name = "uk_wish_list_userid", columnNames = "user_id")
)
public class WishList {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "user_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_wishlist_userid"
      )
  )
  private User user;

  @OneToMany(
      mappedBy = "wishList",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  @Builder.Default
  private List<WishListItem> items = new ArrayList<>();

  @CreationTimestamp
  private LocalDateTime createdAt;

}
