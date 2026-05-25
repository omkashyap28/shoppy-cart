package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.PaymentRequestDto;
import com.omkashyap.com.backend.dto.requestDto.PaymentUpdateRequestDto;
import com.omkashyap.com.backend.dto.responseDto.PaymentResponseDto;

public interface PaymentService {

  PaymentResponseDto makePayment(PaymentRequestDto requestDto);

  PaymentResponseDto getPaymentByPaymentId(String paymentId);

  PaymentResponseDto updatePaymentByPaymentId(
      String paymentId, PaymentUpdateRequestDto requestDto
  );
}
