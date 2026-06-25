package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.AddressRequestDto;
import com.omkashyap.com.backend.dto.responseDto.AllAddressResponseDto;
import com.omkashyap.com.backend.entity.Address;
import com.omkashyap.com.backend.repository.AddressRepository;
import com.omkashyap.com.backend.service.AddressService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

  private final AddressRepository addressRepository;
  private final ModelMapper modelMapper;

  @Override
  @Transactional
  public void deleteAddress(String userId, String addressId) {
    addressRepository.deleteByUser_UserIdAndAddressId(userId, addressId);
  }

  @Override
  @Transactional
  public List<AllAddressResponseDto> partialUpdateAddress(
    String userId,
    String addressId,
    Map<String, String> updates
  ) {
    
    Address address = addressRepository.findByUser_UserIdAndAddressId(userId, addressId).orElseThrow(() -> 
      new IllegalArgumentException("Address not exists")
    );

    updates.forEach((key, value) -> {
      switch(key) {
        case "address":
          address.setAddress(value);
          break;
        case "street":
          address.setStreet(value);
          break;
        case "isDefault":
          addressRepository.clearDefault(userId);
          address.setIsDefault(Boolean.valueOf(value));
          break;
        default:
          throw new IllegalStateException("Unexpected value: " + key);
      };
      addressRepository.save(address);
    });

    List<Address> allAddresses = addressRepository.findByUser_UserId(userId);

    return allAddresses.stream()
    .map(add -> modelMapper.map(add, AllAddressResponseDto.class))
      .toList();
  }
}
