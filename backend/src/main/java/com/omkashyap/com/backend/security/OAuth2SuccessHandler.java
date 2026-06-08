package com.omkashyap.com.backend.security;

import com.omkashyap.com.backend.dto.responseDto.AuthResponseDto;
import com.omkashyap.com.backend.service.OAuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  private final OAuthService authService;

  @Override
  public void onAuthenticationSuccess(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
      @NonNull Authentication authentication) throws IOException {
    OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
    OAuth2User user = ((OAuth2AuthenticationToken) authentication).getPrincipal();

    String registrationId = token.getAuthorizedClientRegistrationId();

    AuthResponseDto authResponseDto = authService.handleOAuth2LoginRequest(user, registrationId);

    Cookie cookie = new Cookie(
        "refreshToken",
        authResponseDto.getRefreshToken());
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge(7 * 24 * 60 * 60);

    response.addCookie(cookie);

    response.sendRedirect("http://localhost:3000");

  }
}
