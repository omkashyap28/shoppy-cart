package com.omkashyap.com.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

  @Value("${jwt.secretKey}")
  private String SECRET;

  private static final long EXPIRATION_TIME = (10 * 60 * 1000);
  private static final long REFRESH_TOKEN_EXPIRATION_TIME = (7 * 24 * 60 * 60 * 1000);

  private SecretKey getSecretKey() {
    return Keys.hmacShaKeyFor(
        SECRET.getBytes(StandardCharsets.UTF_8));
  }

  public String generateAccessToken(String subject) {
    return Jwts.builder()
        .subject(subject)
        .claim("type", "access")
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(getSecretKey())
        .compact();
  }

  public String generateRefreshToken(String subject) {
    return Jwts.builder()
        .subject(subject)
        .claim("type", "refresh")
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_TIME))
        .signWith(getSecretKey())
        .compact();
  }

  public String getUserEmailFromToken(String token) {
    return extractClaims(token) != null ? extractClaims(token).getSubject() : null;
  }

  public String getTokenType(String token) {
    return extractClaims(token) != null ? extractClaims(token).get("type", String.class) : null;
  }

  public boolean isRefreshToken(String token) {
    return "refresh".equals(getTokenType(token));
  }

  public boolean isAccessToken(String token) {
    return "access".equals(getTokenType(token));
  }

  public boolean isTokenValid(String token) {
    try {
      return extractClaims(token) != null;
    } catch (ExpiredJwtException e) {
      log.error("Token expired {}", e);
    } catch (Exception e) {
      log.error("Invalid token {}", e);
    }
    return false;
  }

  public boolean isTokenExpired(String token) {
    try {
      return extractClaims(token).getExpiration().before(new Date());
    } catch (ExpiredJwtException e) {
      log.error("Token expired {}", e);
      return true;
    }
  }

  private Claims extractClaims(String token) {
    try {
      return Jwts.parser()
          .verifyWith(getSecretKey())
          .build()
          .parseSignedClaims(token)
          .getPayload();
    } catch (JwtException e) {
      log.error("Invalid token {}", e);
    } catch (Exception e) {
      log.error("Invalid token {}", e);
    }
    return null;
  }
}
