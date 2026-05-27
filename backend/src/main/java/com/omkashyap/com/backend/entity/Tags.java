package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tags {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Long id;

  @Column(
      nullable = false,
      unique = true,
      length = 100,
      updatable = false
  )
  private String tagName;

  @Column(
      nullable = false,
      unique = true,
      length = 120,
      updatable = false
  )
  private String slug;

}
