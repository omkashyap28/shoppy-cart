package com.omkashyap.com.backend.dto.responseDto;

import com.omkashyap.com.backend.type.PaymentMethodEnum;
import com.omkashyap.com.backend.type.PaymentStatusEnum;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WalletPaymentResponseDto {

  private String transactionId;
  private Long coins;
  private PaymentMethodEnum paymentMethod;
  private PaymentStatusEnum paymentStatus;
  private LocalDateTime paidAt;

}
