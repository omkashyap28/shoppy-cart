package com.omkashyap.com.backend.dto.requestDto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class WalletRequestDto {

  @NotNull
  @Min(value = 1000, message = "MPIN must be 4 digits")
  @Max(value = 9999, message = "MPIN must be 4 digits")
  private Integer mPin;

}
