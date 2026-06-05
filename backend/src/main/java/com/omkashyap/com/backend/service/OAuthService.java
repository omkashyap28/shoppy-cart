package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.responseDto.AuthResponseDto;
import com.omkashyap.com.backend.dto.responseDto.LoginResponseDto;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface OAuthService {
  AuthResponseDto handleOAuth2LoginRequest(
      OAuth2User oAuth2User,
      String registrationId
  );

}
