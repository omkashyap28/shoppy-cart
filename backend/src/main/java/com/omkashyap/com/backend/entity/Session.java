package com.omkashyap.com.backend.entity;

import com.omkashyap.com.backend.type.LoginProviderType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
    indexes = {
        @Index(name = "idx_session_userid", columnList = "user_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_session_refreshtoken", columnNames = "refresh_token"),
        @UniqueConstraint(name = "uk_session_sessionid", columnNames = "session_id")
    }
)
public class Session {

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
          name = "fk_session_userid"
      )
  )
  private User user;

  @Column(
      nullable = false,
      updatable = false
  )
  private String sessionId;

  @Column(
      nullable = false
  )
  private String refreshToken;

  @Builder.Default
  private Boolean revoked = false;

  private LocalDateTime expiresAt;

  private String userAgent;

  private String ipAddress;

  @Enumerated(EnumType.STRING)
  private LoginProviderType provider;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @PrePersist
  public void initializePublicId() {
    if (this.sessionId == null) {
      this.sessionId = UUID.randomUUID().toString();
    }
  }

}
