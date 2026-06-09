package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.OtpRequestDto;
import com.omkashyap.com.backend.service.OtpService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/otp")
public class OtpController {

  private final OtpService otpService;

  @GetMapping("/generate")
  public ResponseEntity<String> generateOtp(@RequestHeader("Authorization") String authHeader) {

    return ResponseEntity.ok(otpService.generateOtp(authHeader));
  }

  @PostMapping("/verify")
  public ResponseEntity<String> verifyOtp(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody OtpRequestDto requestDto) {

    otpService.verifyOtp(authHeader, requestDto);

    return ResponseEntity.ok("OTP verified successfully");
  }
}