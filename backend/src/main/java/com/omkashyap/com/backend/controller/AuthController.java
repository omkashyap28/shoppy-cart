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

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

  private final AuthService authService;
  private final SellerService sellerService;

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
        new LoginResponseDto(
            responseDto.getAccessToken()));
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
        new LoginResponseDto(
            authResponseDto.getAccessToken()));
  }

  @DeleteMapping("/logout")
  void logout(@CookieValue("refreshToken") String refreshToken) {
    authService.logout(refreshToken);
  }

  @PostMapping("/seller/register")
  ResponseEntity<SellerResponseDto> registerSeller(@Valid @RequestBody SellerRequestDto requestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(sellerService.registerSeller(requestDto));
  }

  @PostMapping("/seller/login")
  ResponseEntity<LoginResponseDto> loginSeller(@RequestBody SellerRequestDto requestDto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(sellerService.loginSeller(requestDto));
  }

}
