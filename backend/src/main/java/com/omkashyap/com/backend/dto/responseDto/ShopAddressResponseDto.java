package com.omkashyap.com.backend.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShopAddressResponseDto {

  private String address;

  private String street;

  private String city;

  private String state;

  private String postalCode;

  private String country;

}
