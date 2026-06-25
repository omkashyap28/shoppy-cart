package com.omkashyap.com.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.omkashyap.com.backend.dto.requestDto.AddressRequestDto;
import com.omkashyap.com.backend.dto.responseDto.AllAddressResponseDto;

@Service

public interface AddressService {


  void deleteAddress(String userId, String addressId);

  List<AllAddressResponseDto> partialUpdateAddress(String userId, String addressId, Map<String, String> updates);
}
