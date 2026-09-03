package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.LoginRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SellerRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SignUpRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ResetPasswordRequestDto;
import com.omkashyap.com.backend.dto.responseDto.*;
import com.omkashyap.com.backend.service.AffiliateUserService;
import com.omkashyap.com.backend.service.AuthService;
import com.omkashyap.com.backend.service.SellerService;
import com.omkashyap.com.backend.util.AuthHeaderUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.omkashyap.com.backend.security.JwtUtil;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

  private final AuthService authService;
  private final SellerService sellerService;
  private final JwtUtil jwtUtil;
  private final AffiliateUserService affiliateUserService;
  private  final AuthHeaderUtil authHeaderUtil;

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

    Cookie deviceCookie = new Cookie("shoppyDeviceId", responseDto.getDeviceId());
    deviceCookie.setPath("/");
    deviceCookie.setHttpOnly(true);
    deviceCookie.setSecure(false);
    deviceCookie.setAttribute("SameSite", "Lax");
    deviceCookie.setMaxAge(30 * 24 * 60 * 60);

    if(responseDto.getSellerId() != null && !responseDto.getSellerId().isEmpty()) {
      Cookie sellerCookie = new Cookie(
          "hasSellerAccount", "true"
      );
      sellerCookie.setPath("/");
      sellerCookie.setHttpOnly(true);
      sellerCookie.setSecure(false);
      sellerCookie.setAttribute("SameSite", "Lax");
      sellerCookie.setMaxAge(30 * 24 * 60 * 60);
      response.addCookie(sellerCookie);
    }

    if(responseDto.getAffiliateCode() != null && !responseDto.getAffiliateCode().isEmpty()) {
      Cookie affiliateCookie = new Cookie(
          "hasAffiliateAccount", "true"
      );
      affiliateCookie.setPath("/");
      affiliateCookie.setHttpOnly(true);
      affiliateCookie.setSecure(false);
      affiliateCookie.setAttribute("SameSite", "Lax");
      affiliateCookie.setMaxAge(30 * 24 * 60 * 60);
      response.addCookie(affiliateCookie);
    }

    response.addCookie(cookie);
    response.addCookie(deviceCookie);

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

  @PatchMapping("/password/reset")
  ResponseEntity<ResetPasswordResponseDto> resetPassword(
      @RequestHeader("authorization") String authHeader,
      @Valid @RequestBody ResetPasswordRequestDto requestDto
  ) {

    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);
    return ResponseEntity.status(HttpStatus.OK).body(authService.resetPassword(email, requestDto));
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

    Cookie deviceCookie = new Cookie("shoppyDeviceId", authResponseDto.getDeviceId());
    deviceCookie.setPath("/");
    deviceCookie.setHttpOnly(true);
    deviceCookie.setSecure(false);
    deviceCookie.setAttribute("SameSite", "Lax");
    deviceCookie.setMaxAge(30 * 24 * 60 * 60);

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
    cookie.setMaxAge(0);
    response.addCookie(cookie);
    
    authService.logout(refreshToken);
  }

  @DeleteMapping("/logout/all-devices")
  ResponseEntity<Void> logoutAllSessions(@RequestHeader("Authorization") String authHeader) {
    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);
    authService.logoutAllSessions(email);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/logout/session/{sessionId}")
  ResponseEntity<Void> logoutSessionBySessionId(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable String sessionId
  ) {
    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);
    authService.logoutSessionBySessionId(email, sessionId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/active-session")
  ResponseEntity<List<SessionResponseDto>> getAllActiveSessions(
      @RequestHeader("Authorization") String authHeader,
      @CookieValue(name = "shoppyDeviceId", required = true) String deviceId
  ) {
    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);
    return ResponseEntity.status(HttpStatus.OK).body(authService.getAllActiveSessions(email, deviceId));
  }

  @PostMapping("/clear-session")
  public ResponseEntity<Void> clearSession(HttpServletResponse response) {
    clearCookie(response, "accessToken");
    clearCookie(response, "refreshToken");
    clearCookie(response, "hasSellerAccount");
    clearCookie(response, "hasAffiliateAccount");
    return ResponseEntity.noContent().build();
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
    sellerCookie.setPath("/");
    sellerCookie.setHttpOnly(true);
    sellerCookie.setSecure(false);
    sellerCookie.setAttribute("SameSite", "Lax");
    sellerCookie.setMaxAge(30 * 24 * 60 * 60);

    response.addCookie(cookie);
    response.addCookie(sellerCookie);

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
    affiliateCookie.setSecure(false);
    affiliateCookie.setHttpOnly(true);
    affiliateCookie.setMaxAge(30 * 24 * 60 * 60);
    affiliateCookie.setPath("/");

    response.addCookie(cookie);
    response.addCookie(affiliateCookie);

    return ResponseEntity.status(HttpStatus.CREATED).body(
        AffiliateUserResponseDto.builder()
            .affiliateCode(responseDto.getAffiliateCode())
            .userId(responseDto.getUserId())
            .build()
    );
  }


  private void clearCookie(HttpServletResponse response, String name) {
    ResponseCookie cookie = ResponseCookie.from(name, "")
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(0)        // tells the browser to delete it immediately
        .sameSite("Lax")  // match whatever you used when setting the cookie originally
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }

}
