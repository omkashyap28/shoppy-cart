package com.omkashyap.com.backend.dto.requestDto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AffiliateProductRequestDto {

  @NotNull(message = "Product id is required")
  private String productId;

}
