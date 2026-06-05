package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.responseDto.AuthResponseDto;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface OAuthService {
  AuthResponseDto handleOAuth2LoginRequest(
      OAuth2User oAuth2User,
      String registrationId
  );

}
