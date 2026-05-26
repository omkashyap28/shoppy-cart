package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.OtpRequestDto;

public interface OtpService {
  String generateOtp(String user);

  void verifyOtp(String user, OtpRequestDto enteredOtp);
}
