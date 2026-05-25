package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.WalletPaymentRequestDto;
import com.omkashyap.com.backend.dto.requestDto.WalletRequestDto;
import com.omkashyap.com.backend.dto.responseDto.WalletPaymentResponseDto;
import com.omkashyap.com.backend.dto.responseDto.WalletResponseDto;
import jakarta.validation.Valid;

public interface WalletService {
  WalletResponseDto createUserWallet(String authHeader, @Valid WalletRequestDto requestDto);

  WalletResponseDto getUserWallet(String authHeader, @Valid WalletRequestDto requestDto);

  WalletPaymentResponseDto makePayment(String authHeader, WalletPaymentRequestDto requestDto);
}
