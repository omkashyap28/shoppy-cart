package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.OtpRequestDto;
import com.omkashyap.com.backend.dto.responseDto.OtpResponseDto;

public interface OtpService {
  OtpResponseDto generateOtp(String user);

  OtpResponseDto verifyOtp(String user, OtpRequestDto enteredOtp);
}
