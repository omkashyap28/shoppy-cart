package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.OtpRequestDto;
import com.omkashyap.com.backend.dto.responseDto.OtpResponseDto;
import com.omkashyap.com.backend.service.OtpService;

import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/otp")
public class OtpController {

  private final OtpService otpService;

  @GetMapping("/generate")
  public ResponseEntity<OtpResponseDto> generateOtp(@RequestHeader("Authorization") String authHeader) {

    return ResponseEntity.ok(otpService.generateOtp(authHeader));
  }

  @PostMapping("/verify")
  public ResponseEntity<OtpResponseDto> verifyOtp(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody OtpRequestDto requestDto,
      HttpServletResponse response) {

    Cookie cookie = new Cookie("otpVerified", "true");
    cookie.setMaxAge(60 * 60 * 24 * 7);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    response.addCookie(cookie);

    return ResponseEntity.ok(otpService.verifyOtp(authHeader, requestDto));
  }
}