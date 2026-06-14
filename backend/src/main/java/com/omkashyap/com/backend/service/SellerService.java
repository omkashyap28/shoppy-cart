package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.*;
import com.omkashyap.com.backend.dto.responseDto.LoginResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SellerAuthResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SellerResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ShopAddressResponseDto;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface SellerService {

  SellerResponseDto updatePartialSellerDetails(String sellerId, Map<String, Object> updates);

  SellerAuthResponseDto registerSeller(String email, SellerRequestDto requestDto);

  SellerResponseDto getSellerBySellerId(String sellerId);

  ShopAddressResponseDto addAddressBySellerId(String sellerId, AddressRequestDto addressRequestDto);

  ShopAddressResponseDto getSellerAddressBySellerId(String sellerId);

  LoginResponseDto loginSeller(SellerRequestDto requestDto);

  SellerResponseDto addSellerVerification(String sellerId, SellerVerificationRequestDto requestDto);

  SellerResponseDto addSellerAccountInfo(String sellerId, SellerAccountRequestDto requestDto);

  void deleteSellerById(String sellerId);
}
