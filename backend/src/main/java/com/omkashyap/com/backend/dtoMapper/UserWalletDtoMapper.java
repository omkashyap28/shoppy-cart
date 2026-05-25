package com.omkashyap.com.backend.dtoMapper;

import com.omkashyap.com.backend.dto.responseDto.WalletPaymentResponseDto;
import com.omkashyap.com.backend.dto.responseDto.WalletResponseDto;
import com.omkashyap.com.backend.entity.Payment;
import com.omkashyap.com.backend.entity.UserWallet;
import org.springframework.stereotype.Component;

@Component
public class UserWalletDtoMapper {

  public WalletResponseDto mapToWalletResponseDto(UserWallet userWallet) {
    return WalletResponseDto.builder()
        .walletId(userWallet.getWalletId())
        .coins(userWallet.getCoins())
        .totalCredits(userWallet.getTotalCredits())
        .totalDebits(userWallet.getTotalDebits())
        .build();
  }

  public WalletPaymentResponseDto mapToWalletPaymentResponseDto(Payment payment) {
    return WalletPaymentResponseDto.builder()
        .transactionId(payment.getTransactionId())
        .coins(payment.getCoins())
        .paymentMethod(payment.getPaymentMethod())
        .paymentStatus(payment.getPaymentStatus())
        .paidAt(payment.getPaidAt())
        .build();
  }
}
