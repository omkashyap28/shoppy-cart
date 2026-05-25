package com.omkashyap.com.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.omkashyap.com.backend.type.GenderEnum;
import com.omkashyap.com.backend.type.LoginProviderType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
    indexes = {
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_contact", columnList = "contact")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_contact", columnNames = "contact"),
        @UniqueConstraint(name = "uk_user_email", columnNames = "email")
    }
)
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      unique = true,
      updatable = false,
      length = 32
  )
  private String userId;

  @Column(
      nullable = false,
      length = 50
  )
  private String firstName;

  @Column(
      length = 50
  )
  private String lastName;

  @Column(
      nullable = false,
      length = 100,
      unique = true
  )
  private String email;

  @Column(
      nullable = true,
      length = 15,
      unique = true
  )
  private String contact;

  @Enumerated(EnumType.STRING)
  private GenderEnum gender;

  private LocalDate dateOfBirth;

  private String providerId;

  @Enumerated(EnumType.STRING)
  private LoginProviderType providerType;

  @Builder.Default
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id")
  )
  private Set<Role> roles = new HashSet<>();

  @Column(
      length = 255
  )
  private String password;

  @Column(
      unique = true
  )
  private String avatarUrl;

  @OneToMany(
      mappedBy = "user",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private List<Address> addresses = new ArrayList<>();

  @JsonIgnore
  @OneToMany(
      mappedBy = "user",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private List<Session> sessions = new ArrayList<>();

  @JsonIgnore
  @OneToOne(
      mappedBy = "user",
      orphanRemoval = true,
      cascade = CascadeType.ALL
  )
  private WishList wishList;

  @JsonIgnore
  @OneToMany(
      mappedBy = "user",
      orphanRemoval = true,
      cascade = CascadeType.ALL
  )
  private List<Cart> cart = new ArrayList<>();

  @JsonIgnore
  @OneToMany(
      mappedBy = "user",
      orphanRemoval = true,
      cascade = CascadeType.ALL
  )
  private List<Review> reviews = new ArrayList<>();

  @OneToOne(
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      mappedBy = "user"
  )
  private Seller seller;

  @OneToOne(
      mappedBy = "user",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private AffiliateUser affiliateUser;

  @OneToOne(
      mappedBy = "user",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private UserWallet wallet;

  @OneToMany(
      mappedBy = "user",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private List<Invoice> invoice;

  @Column(updatable = false)
  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;


  public User(String firstName, String lastName, String email, String contact, GenderEnum gender, LocalDate dateOfBirth, String password, String avatarUrl) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.contact = contact;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.password = password;
    this.avatarUrl = avatarUrl;
  }

  @PrePersist
  public void initializeUserId() {
    if (this.userId == null) {
      this.userId = UUID.randomUUID().toString().replace("-", "");
    }
  }

  @Override
  public @NonNull Collection<? extends GrantedAuthority> getAuthorities() {
    return roles.stream()
        .map(role -> new SimpleGrantedAuthority(role.getRole().toString()))
        .toList();
  }

  @Override
  public @NonNull String getUsername() {
    return email;
  }

}
