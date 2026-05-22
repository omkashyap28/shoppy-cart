package com.omkashyap.com.backend.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchSuggestion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Long id;

  @Column(
      nullable = false
  )
  private String keyword;

  @Builder.Default
  private Long totalSearches = 0L;

  public void incrementTotalSearches() {
    this.totalSearches++;
  }

}
