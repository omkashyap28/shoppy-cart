package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.LoginRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SignUpRequestDto;
import com.omkashyap.com.backend.dto.responseDto.AuthResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SignUpResponseDto;

public interface AuthService {

  AuthResponseDto login(LoginRequestDto requestDto);

  SignUpResponseDto signup(SignUpRequestDto signUpRequestDto);

  void logout(String token);

  AuthResponseDto refresh(String refreshToken);
}
