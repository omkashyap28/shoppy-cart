package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.OtpRequestDto;
import com.omkashyap.com.backend.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/otp")
public class OtpController {

  private final OtpService otpService;

  @PostMapping("/generate")
  public String generateOtp(@RequestHeader("Authorization") String authHeader) {

    return otpService.generateOtp(authHeader);
  }

  @PostMapping("/verify")
  public String verifyOtp(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody OtpRequestDto requestDto
  ) {

    otpService.verifyOtp(authHeader, requestDto);

    return "OTP verified successfully";
  }
}