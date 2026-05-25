package com.omkashyap.com.backend.dtoMapper;

import com.omkashyap.com.backend.dto.responseDto.PaymentResponseDto;
import com.omkashyap.com.backend.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentDtoMapper {

  public PaymentResponseDto mapToDto(Payment payment) {
    return PaymentResponseDto.builder()
        .paymentId(payment.getPaymentId())
        .transactionId(payment.getTransactionId())
        .paymentMethod(payment.getPaymentMethod())
        .paymentStatus(payment.getPaymentStatus())
        .paidAt(payment.getPaidAt())
        .build();
  }

}
