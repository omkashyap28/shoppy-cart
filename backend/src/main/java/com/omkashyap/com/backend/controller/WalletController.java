package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.WalletPaymentRequestDto;
import com.omkashyap.com.backend.dto.requestDto.WalletRequestDto;
import com.omkashyap.com.backend.dto.responseDto.WalletPaymentResponseDto;
import com.omkashyap.com.backend.dto.responseDto.WalletResponseDto;
import com.omkashyap.com.backend.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/wallet")
public class WalletController {

  private final WalletService walletService;

  @PostMapping
  ResponseEntity<WalletResponseDto> createUserWallet(
      @RequestHeader("Authorization") String authHeader,
      @Valid @RequestBody WalletRequestDto requestDto
  ) {
    return ResponseEntity.status(HttpStatus.CREATED).body(
        walletService.createUserWallet(authHeader, requestDto)
    );
  }

  @PostMapping("/validate")
  ResponseEntity<WalletResponseDto> validateUserWallet(
      @RequestHeader("Authorization") String authHeader,
      @Valid @RequestBody WalletRequestDto requestDto
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        walletService.getUserWallet(authHeader, requestDto)
    );
  }

  @PostMapping("/payment")
  ResponseEntity<WalletPaymentResponseDto> makePayment(
      @RequestHeader("Authorization") String authHeader,
      @Valid @RequestBody WalletPaymentRequestDto requestDto
  ) {
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(
        walletService.makePayment(authHeader, requestDto)
    );
  }


}
