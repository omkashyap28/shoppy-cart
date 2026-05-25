package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.PaymentRequestDto;
import com.omkashyap.com.backend.dto.requestDto.PaymentUpdateRequestDto;
import com.omkashyap.com.backend.dto.responseDto.PaymentResponseDto;
import com.omkashyap.com.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payments/payment")
public class PaymentController {

  private final PaymentService paymentService;

  @PostMapping
  ResponseEntity<PaymentResponseDto> makePayment(@RequestBody PaymentRequestDto requestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(
        paymentService.makePayment(requestDto)
    );
  }

  @GetMapping("/{paymentId}")
  ResponseEntity<PaymentResponseDto> getPaymentByPaymentId(@PathVariable String paymentId) {
    return ResponseEntity.status(HttpStatus.OK).body(
        paymentService.getPaymentByPaymentId(paymentId)
    );
  }

  @PatchMapping("/{paymentId}")
  ResponseEntity<PaymentResponseDto> updatePaymentByPaymentId(@PathVariable String paymentId, PaymentUpdateRequestDto requestDto) {
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(
        paymentService.updatePaymentByPaymentId(paymentId, requestDto)
    );
  }

}
