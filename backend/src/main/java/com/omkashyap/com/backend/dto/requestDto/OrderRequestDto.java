package com.omkashyap.com.backend.dto.requestDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDto {

  public String productId;
  public String addressId;
  private Map<String, String> selectedAttributes;
  private Integer quantity;

}
