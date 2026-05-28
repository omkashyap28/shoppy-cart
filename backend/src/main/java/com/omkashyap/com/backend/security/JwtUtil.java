package com.omkashyap.com.backend.security;

import com.omkashyap.com.backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

  @Value("${jwt.secretKey}")
  private String SECRET;

  private static final long EXPIRATION_TIME = 86400000;

  private SecretKey getSecretKey() {
    return Keys.hmacShaKeyFor(
        SECRET.getBytes(StandardCharsets.UTF_8)
    );
  }

  public String generateAccessToken(String subject) {
    return Jwts.builder()
        .subject(subject)
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(getSecretKey())
        .compact();
  }

  public String getUserEmailFromToken(String token) {
    return Jwts.parser()
        .verifyWith(getSecretKey())
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getSubject();
  }
}
