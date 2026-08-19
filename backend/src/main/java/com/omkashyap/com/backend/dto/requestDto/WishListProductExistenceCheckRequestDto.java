package com.omkashyap.com.backend.dto.requestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WishListProductExistenceCheckRequestDto {

  @NotBlank(message = "Product ID is requried")
  @Size(min = 32, max = 32, message = "Id size should be extactly 32 chars")
  private String productId;
}
