package com.omkashyap.com.backend.entity;

import com.omkashyap.com.backend.type.PaymentMethodEnum;
import com.omkashyap.com.backend.type.PaymentStatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
    indexes = @Index(name = "idx_payment_paymentid", columnList = "payment_id"),
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_payment_paymentid", columnNames = "payment_id"),
        @UniqueConstraint(name = "uk_payment_orderid", columnNames = "order_id")
    }
)
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
      nullable = false,
      length = 40
  )
  private String paymentId;

  @OneToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "order_id",
      foreignKey = @ForeignKey(
          name = "fk_payment_orderid"
      )
  )
  private OrderItem orderItem;

  @Enumerated(EnumType.STRING)
  @Column(
      nullable = false
  )
  private PaymentMethodEnum paymentMethod;

  @Enumerated(EnumType.STRING)
  @Column(
      nullable = false
  )
  private PaymentStatusEnum paymentStatus;

  private Double amount;

  private Long coins;

  @Column(
      length = 100
  )
  private String transactionId;

  private LocalDateTime paidAt;

  @OneToMany(
      mappedBy = "payment",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private List<Invoice> invoiceList;

  @PrePersist
  void generateId() {
    if (this.paymentId == null) {
      this.paymentId = UUID.randomUUID().toString().replace("-", "");
    }
  }
}
