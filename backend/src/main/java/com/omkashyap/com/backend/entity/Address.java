package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(
    indexes = @Index(name = "idx_address_user_id", columnList = "user_id")
)
public class Address {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(
      fetch = FetchType.EAGER
  )
  @JoinColumn(
      name = "user_id",
      nullable = false,
      foreignKey = @ForeignKey(
          name = "fk_address_userid"
      )
  )
  private User user;

  @Column(nullable = false, unique = true)
  private String addressId;

  @Column(nullable = false, length = 150)
  private String address;

  @Column(nullable = false, length = 100)
  private String street;

  @Column(nullable = false, length = 100)
  private String city;

  @Column(nullable = false, length = 100)
  private String state;

  @Column(nullable = false, length = 20)
  private String postalCode;

  @Column(nullable = false, length = 100)
  private String country;

  private Boolean isDefault;

  @OneToMany(
      mappedBy = "address"
  )
  private List<OrderItem> orderItem;

  @PrePersist
  void generateAddressId() {
    if (this.addressId == null) {
      this.addressId = "add-" + java.util.UUID.randomUUID().toString().substring(0, 8);
    }

  }
}
