package com.omkashyap.com.backend.util;

import com.omkashyap.com.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthHeaderUtil {

  private final JwtUtil jwtUtil;

  public String getEmailFromAuthHeader(String authHeader) {
    String token = authHeader.substring(7);
    return jwtUtil.getUserEmailFromToken(token);
  }

}
