package com.omkashyap.com.backend.dto.requestDto;

import com.omkashyap.com.backend.type.PaymentMethodEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class PaymentRequestDto {

  private String orderId;
  private PaymentMethodEnum paymentMethod;

}
