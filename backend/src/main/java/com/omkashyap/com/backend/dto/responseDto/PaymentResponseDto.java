package com.omkashyap.com.backend.dto.responseDto;

import com.omkashyap.com.backend.type.PaymentMethodEnum;
import com.omkashyap.com.backend.type.PaymentStatusEnum;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponseDto {

  private String paymentId;
  private String transactionId;
  private PaymentMethodEnum paymentMethod;
  private PaymentStatusEnum paymentStatus;
  private LocalDateTime paidAt;

}
