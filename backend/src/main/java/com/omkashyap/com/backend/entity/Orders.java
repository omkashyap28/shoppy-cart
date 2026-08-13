package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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
        @Index(name = "idx_order_orderid", columnList = "order_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_order_orderid", columnNames = "order_id")
    }
)
public class Orders {

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
          name = "fk_orders_userid"
      )
  )
  private User user;

  @OneToMany(
      mappedBy = "order",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  @Builder.Default
  private List<OrderItem> items = new ArrayList<>();

}
