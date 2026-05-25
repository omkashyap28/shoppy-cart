package com.omkashyap.com.backend.util;

import com.omkashyap.com.backend.entity.OrderItem;
import com.omkashyap.com.backend.entity.Payment;
import com.omkashyap.com.backend.entity.UserWallet;
import com.omkashyap.com.backend.repository.UserWalletRepository;
import com.omkashyap.com.backend.type.PaymentMethodEnum;
import com.omkashyap.com.backend.type.PaymentStatusEnum;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import static com.omkashyap.com.backend.type.PaymentMethodEnum.PAY_ON_DELIVERY;
import static com.omkashyap.com.backend.type.PaymentMethodEnum.UPI;

@Component
@RequiredArgsConstructor
public class PaymentUtil {

  private final UserWalletRepository userWalletRepository;

  public Payment createUpiPayment(OrderItem orderItem) {
    return Payment.builder()
        .orderItem(orderItem)
        .paymentMethod(UPI)
        .paymentStatus(PaymentStatusEnum.SUCCESS)
        .amount(orderItem.getAmount() * orderItem.getQuantity())
        .coins(null)
        .paidAt(LocalDateTime.now())
        .build();
  }

  public Payment createWalletPayment(OrderItem orderItem) {
    UserWallet wallet = userWalletRepository.findByUser_Email(orderItem.getOrder().getUser().getEmail()).orElseThrow(() ->
        new IllegalArgumentException("Wallet not exists for this user"));

    Payment newPayment = Payment.builder()
        .orderItem(orderItem)
        .paymentMethod(PaymentMethodEnum.WALLET)
        .paymentStatus(PaymentStatusEnum.PENDING)
        .amount(null)
        .coins(((long) orderItem.getCoins() * orderItem.getQuantity()))
        .build();

    userWalletRepository.save(wallet);
    return newPayment;

  }

  @Transactional
  public Payment createPayOnDeliveryPayment(OrderItem orderItem) {
    return Payment.builder()
        .orderItem(orderItem)
        .paymentMethod(PAY_ON_DELIVERY)
        .paymentStatus(PaymentStatusEnum.PENDING)
        .amount(orderItem.getAmount() * orderItem.getQuantity())
        .coins(null)
        .paidAt(LocalDateTime.now())
        .build();
  }

  public String generateTransactionId() {
    String currentDateTime = LocalDateTime.now().format(
        DateTimeFormatter.ofPattern(
            "yyyyMMddHHmmss"
        )
    );

    return currentDateTime +
        UUID.randomUUID()
            .toString()
            .substring(15)
            .replace("-", "");
  }

}
