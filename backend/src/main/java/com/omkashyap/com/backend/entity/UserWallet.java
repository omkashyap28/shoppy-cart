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
    name = "user_wallet",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_user_wallet_wallet_id",
            columnNames = "wallet_id"
        ),
        @UniqueConstraint(
            name = "uk_user_wallet",
            columnNames = {"wallet_id", "user_id"}
        )
    }
)
public class UserWallet {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Long id;

  @Column(
      name = "wallet_id",
      nullable = false,
      unique = true,
      updatable = false
  )
  private String walletId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "user_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_wallet_user")
  )
  private User user;

  @Column(nullable = false)
  @Builder.Default
  private Long coins = 0L;

  @Column(nullable = false)
  @Builder.Default
  private Long totalCredits = 0L;

  @Column(nullable = false)
  @Builder.Default
  private Long totalDebits = 0L;

  @Column(nullable = false)
  @Builder.Default
  private Boolean isActive = true;

  @Column(
      nullable = false
  )
  private String mPin;

  @Column(
      nullable = false
  )
  @Builder.Default
  private Integer invalidAttempts = 0;

  @Column(
      nullable = false
  )
  @Builder.Default
  private Boolean isLocked = false;

  private LocalDateTime lockedUntil;

  @CreationTimestamp
  @Column(
      nullable = false,
      updatable = false
  )
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  public void generateWalletId() {
    if (this.walletId == null) {
      this.walletId = "WALLET-" + UUID.randomUUID();
    }
  }

}