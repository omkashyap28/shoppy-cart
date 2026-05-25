package com.omkashyap.com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Invoice {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "order_id",
      foreignKey = @ForeignKey(
          name = "fk_invoice_orderid"
      ),
      nullable = false
  )
  private OrderItem orderItem;

  @Column(
      nullable = false
  )
  private String invoiceNo;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "user_id",
      foreignKey = @ForeignKey(
          name = "fk_user_id"
      ),
      nullable = false
  )
  private User user;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "user_address_id",
      foreignKey = @ForeignKey(
          name = "fk_user_address_id"
      ),
      nullable = false
  )
  private Address billingAddress;

  @ManyToOne(
      fetch = FetchType.LAZY
  )
  @JoinColumn(
      name = "payment_id",
      foreignKey = @ForeignKey(
          name = "fk_payment_id"
      )
  )
  private Payment payment;

  @PrePersist
  void generateInvoiceNumber() {
    if (this.invoiceNo == null) {
      this.invoiceNo = UUID.randomUUID().toString().replace("-", "");
    }
  }

}
