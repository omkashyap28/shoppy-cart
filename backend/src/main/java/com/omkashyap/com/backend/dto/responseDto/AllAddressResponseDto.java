package com.omkashyap.com.backend.dto.responseDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AllAddressResponseDto {

  private String addressId;

  private String address;

  private String street;

  private String city;

  private String state;

  private String country;

  private Boolean isDefault;

  private String postalCode;

}
