package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.LoginRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SellerRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SignUpRequestDto;
import com.omkashyap.com.backend.dto.responseDto.*;
import com.omkashyap.com.backend.service.AffiliateUserService;
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
  private final AffiliateUserService affiliateUserService;

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

    Cookie userIdCookie = new Cookie("userId", responseDto.getUserId());
    userIdCookie.setHttpOnly(true);
    userIdCookie.setSecure(false);
    userIdCookie.setPath("/");
    userIdCookie.setAttribute("SameSite", "Lax");
    userIdCookie.setMaxAge(7 * 24 * 60 * 60);

    Cookie userEmailCookie = new Cookie("userEmail", responseDto.getEmail());
    userEmailCookie.setHttpOnly(true);
    userEmailCookie.setSecure(false);
    userEmailCookie.setPath("/");
    userEmailCookie.setAttribute("SameSite", "Lax");
    userEmailCookie.setMaxAge(7 * 24 * 60 * 60);

    response.addCookie(cookie);
    response.addCookie(userIdCookie);
    response.addCookie(userEmailCookie);

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

    Cookie userIdCookie = new Cookie("userId", authResponseDto.getUserId());
    userIdCookie.setHttpOnly(true);
    userIdCookie.setSecure(false);
    userIdCookie.setPath("/");
    userIdCookie.setAttribute("SameSite", "Lax");
    userIdCookie.setMaxAge(7 * 24 * 60 * 60);

    Cookie userEmailCookie = new Cookie("userEmail", authResponseDto.getEmail());
    userEmailCookie.setHttpOnly(true);
    userEmailCookie.setSecure(false);
    userEmailCookie.setPath("/");
    userEmailCookie.setAttribute("SameSite", "Lax");
    userEmailCookie.setMaxAge(7 * 24 * 60 * 60);


    if(authResponseDto.getSellerId() != null && !authResponseDto.getSellerId().isEmpty()) {
      Cookie sellerCookie = new Cookie("hasSellerAccount", "true");
      sellerCookie.setSecure(false);
      sellerCookie.setHttpOnly(true);
      sellerCookie.setMaxAge(7 * 24 * 60 * 60);
      sellerCookie.setPath("/");

      response.addCookie(sellerCookie);
    }

    if(authResponseDto.getAffiliateCode() != null && !authResponseDto.getAffiliateCode().isEmpty()) {
      Cookie affiliateCookie = new Cookie("hasAffiliateAccount", "true");
      affiliateCookie.setSecure(false);
      affiliateCookie.setHttpOnly(true);
      affiliateCookie.setMaxAge(7 * 24 * 60 * 60);
      affiliateCookie.setPath("/");

      response.addCookie(affiliateCookie);

    }

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
    @Valid @RequestBody SellerRequestDto requestDto,
    HttpServletResponse response
  ) {
    String token = authHeader.substring(7);
    String email = jwtUtil.getUserEmailFromToken(token);

    SellerAuthResponseDto responseDto = sellerService.registerSeller(email, requestDto);

    Cookie cookie = new Cookie("refreshToken", responseDto.getRefreshToken());
    cookie.setSecure(false);
    cookie.setHttpOnly(true);
    cookie.setMaxAge(7 * 24 * 60 * 60);
    cookie.setPath("/");

    Cookie sellerCookie = new Cookie("hasSellerAccount", "true");
    cookie.setSecure(false);
    cookie.setHttpOnly(true);
    cookie.setMaxAge(7 * 24 * 60 * 60);
    cookie.setPath("/");

    Cookie otpCookie = new Cookie("otpVerified", null);
    otpCookie.setMaxAge(0);
    cookie.setPath("/");
    cookie.setHttpOnly(true);
    cookie.setSecure(true);

    response.addCookie(cookie);
    response.addCookie(sellerCookie);
    response.addCookie(otpCookie);

    return ResponseEntity.status(HttpStatus.CREATED).body(
        SellerResponseDto.builder()
            .sellerId(responseDto.getSellerId())
            .shopName(requestDto.getShopName())
            .description(responseDto.getDescription())
            .averageRating(responseDto.getAverageRating())
            .ratingCount(responseDto.getRatingCount())
            .category(responseDto.getCategory())
            .products(responseDto.getProducts())
            .shopAddress(responseDto.getShopAddress())
            .isVerified(responseDto.getIsVerified())
            .createdAt(responseDto.getCreatedAt())
            .build()
    );
  }

  @PostMapping("/affiliate/register")
  ResponseEntity<?> registerAffiliateUser(
      @RequestHeader("Authorization") String authHeader,
      HttpServletResponse response
  ) {
    String token = authHeader.substring(7);
    String email = jwtUtil.getUserEmailFromToken(token);

    AffiliateUserAuthResponseDto responseDto = affiliateUserService.registerAffiliateUser(email);

    Cookie cookie = new Cookie("refreshToken", responseDto.getRefreshToken());
    cookie.setHttpOnly(true);
    cookie.setMaxAge(7 * 24 * 60 * 60);
    cookie.setPath("/");

    Cookie affiliateCookie = new Cookie("hasAffiliateAccount", "true");
    cookie.setSecure(false);
    cookie.setHttpOnly(true);
    cookie.setMaxAge(7 * 24 * 60 * 60);
    cookie.setPath("/");

    response.addCookie(cookie);
    response.addCookie(affiliateCookie);

    return ResponseEntity.status(HttpStatus.CREATED).body(
        AffiliateUserResponseDto.builder()
            .affiliateCode(responseDto.getAffiliateCode())
            .userId(responseDto.getUserId())
            .build()
    );
  }

}
