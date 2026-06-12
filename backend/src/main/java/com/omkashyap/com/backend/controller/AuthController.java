package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.LoginRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SellerRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SignUpRequestDto;
import com.omkashyap.com.backend.dto.responseDto.AuthResponseDto;
import com.omkashyap.com.backend.dto.responseDto.LoginResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SellerResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SignUpResponseDto;
import com.omkashyap.com.backend.service.AuthService;
import com.omkashyap.com.backend.service.SellerService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.omkashyap.com.backend.security.JwtUtil;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

  private final AuthService authService;
  private final SellerService sellerService;
  private final JwtUtil jwtUtil;

  @PostMapping("/login")
  ResponseEntity<LoginResponseDto> login(
      @RequestBody LoginRequestDto loginRequestDto,
      HttpServletResponse response) {

    AuthResponseDto responseDto = authService.login(loginRequestDto);

    Cookie cookie = new Cookie(
        "refreshToken",
        responseDto.getRefreshToken());
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setAttribute("SameSite", "Lax");
    cookie.setMaxAge(7 * 24 * 60 * 60);

    response.addCookie(cookie);

    return ResponseEntity.ok(
        LoginResponseDto.builder()
            .token(responseDto.getAccessToken())
            .userId(responseDto.getUserId())
            .email(responseDto.getEmail())
            .sellerId(responseDto.getSellerId())
            .affiliateCode(responseDto.getAffiliateCode())
            .build());
  }

  @PostMapping("/signup")
  ResponseEntity<SignUpResponseDto> signup(@Valid @RequestBody SignUpRequestDto signUpRequestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(signUpRequestDto));
  }

  @PostMapping("/refresh")
  ResponseEntity<LoginResponseDto> refresh(
      @CookieValue("refreshToken") String refreshToken,
      HttpServletResponse response) {
    AuthResponseDto authResponseDto = authService.refresh(refreshToken);

    Cookie cookie = new Cookie(
        "refreshToken",
        authResponseDto.getRefreshToken());
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setAttribute("SameSite", "Lax");
    cookie.setMaxAge(7 * 24 * 60 * 60);
    response.addCookie(cookie);

    return ResponseEntity.status(HttpStatus.OK).body(
        LoginResponseDto.builder()
            .token(authResponseDto.getAccessToken())
            .userId(authResponseDto.getUserId())
            .email(authResponseDto.getEmail())
            .sellerId(authResponseDto.getSellerId())
            .affiliateCode(authResponseDto.getAffiliateCode())
            .build());
  }

  @DeleteMapping("/logout")
  void logout(@CookieValue("refreshToken") String refreshToken, HttpServletResponse response) {
    Cookie cookie = new Cookie("refreshToken", "");
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setAttribute("SameSite", "Lax");
    cookie.setMaxAge(0);
    response.addCookie(cookie);
    
    authService.logout(refreshToken);
  }

  @PostMapping("/seller/register")
  ResponseEntity<SellerResponseDto> registerSeller(
    @RequestHeader("Authorization") String authHeader,
    @Valid @RequestBody SellerRequestDto requestDto
  ) {
    String token = authHeader.substring(7);
    String email = jwtUtil.getUserEmailFromToken(token);
    return ResponseEntity.status(HttpStatus.CREATED).body(
      sellerService.registerSeller(email, requestDto)
    );
  }

}
