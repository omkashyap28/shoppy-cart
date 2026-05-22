package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(
    indexes = {
        @Index(name = "idx_search_user", columnList = "user_id"),
        @Index(name = "idx_search_text", columnList = "searchText")
    }
)
public class SearchHistory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      length = 36
  )
  private String searchId;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "user_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_search_userid"
      )
  )
  private User user;

  @Column(
      nullable = false,
      length = 100
  )
  private String searchText;

  @UpdateTimestamp
  @Column(
      nullable = false
  )
  private LocalDateTime searchedAt;

  @CreationTimestamp
  @Column(
      nullable = false
  )
  private LocalDateTime createdAt;

  public SearchHistory(User user, String searchText, LocalDateTime searchedAt) {
    this.user = user;
    this.searchText = searchText;
  }

  @Builder.Default
  private Long totalSearches = 0L;

  @PrePersist
  void generateId() {
    if (this.searchId == null) {
      this.searchId = UUID.randomUUID().toString();
    }
  }

  public void incrementSearch() {
    this.totalSearches++;
  }
}
