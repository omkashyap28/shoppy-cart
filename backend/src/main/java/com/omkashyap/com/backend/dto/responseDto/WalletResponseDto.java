package com.omkashyap.com.backend.dto.responseDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WalletResponseDto {

  private String walletId;
  private Long coins;
  private Long totalCredits;
  private Long totalDebits;
}
