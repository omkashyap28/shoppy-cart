package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
    name = "otp",
    indexes = {
        @Index(name = "idx_otp_user", columnList = "user_id"),
        @Index(name = "idx_otp_validUntil", columnList = "validUntil")
    }
)
public class Otp {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Long id;

  @Column(nullable = false)
  private String otp;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "user_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_otp_user")
  )
  private User user;

  @Column(nullable = false)
  private LocalDateTime validUntil;

  @Column(nullable = false)
  @Builder.Default
  private boolean verified = false;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @PrePersist
  void onCreate() {

    if (this.validUntil == null) {
      this.validUntil = LocalDateTime.now().plusMinutes(5);
    }

    this.createdAt = LocalDateTime.now();
  }

  public boolean isExpired() {
    return LocalDateTime.now().isAfter(this.validUntil);
  }
}