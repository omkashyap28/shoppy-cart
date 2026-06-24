package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.LoginRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ResetPasswordRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SignUpRequestDto;
import com.omkashyap.com.backend.dto.responseDto.AuthResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ResetPasswordResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SessionResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SignUpResponseDto;
import jakarta.validation.Valid;

import java.util.List;

public interface AuthService {

  AuthResponseDto login(LoginRequestDto requestDto);

  SignUpResponseDto signup(SignUpRequestDto signUpRequestDto);

  void logout(String token);

  AuthResponseDto refresh(String refreshToken);

  ResetPasswordResponseDto resetPassword(String email, @Valid ResetPasswordRequestDto requestDto);

  void logoutAllSessions(String email);

  void logoutSessionBySessionId(String email, String sessionId);

  List<SessionResponseDto> getAllActiveSessions(String email, String deviceId);
}
