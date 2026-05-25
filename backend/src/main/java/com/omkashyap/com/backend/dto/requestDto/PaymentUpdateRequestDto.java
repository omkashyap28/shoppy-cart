package com.omkashyap.com.backend.dto.requestDto;


import com.omkashyap.com.backend.type.PaymentMethodEnum;
import lombok.Data;

@Data
public class PaymentUpdateRequestDto {

  PaymentMethodEnum paymentMethod;

}