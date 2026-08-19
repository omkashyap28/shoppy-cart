package com.omkashyap.com.backend.dto.requestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckProductExistenceInCartRequestDto {

  @NotBlank(message = "Product ID is required")
  @Size(min = 32, max = 32, message = "Id size should be exatctly 32 chars")
  private String productId;

}
