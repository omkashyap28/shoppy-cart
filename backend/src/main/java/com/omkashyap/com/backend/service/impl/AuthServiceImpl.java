package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.LoginRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SignUpRequestDto;
import com.omkashyap.com.backend.dto.responseDto.AuthResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SignUpResponseDto;
import com.omkashyap.com.backend.entity.Role;
import com.omkashyap.com.backend.entity.Session;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.RoleRepository;
import com.omkashyap.com.backend.repository.SessionRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.security.JwtUtil;
import com.omkashyap.com.backend.service.AuthService;
import com.omkashyap.com.backend.type.LoginProviderType;
import com.omkashyap.com.backend.type.RoleEnum;
import com.omkashyap.com.backend.util.EmailUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final SessionRepository sessionRepository;
  private final RoleRepository roleRepository;
  @Autowired
  private HttpServletRequest httpServletRequest;
  private final EmailUtil emailUtil;

  @Override
  @Transactional
  public AuthResponseDto login(LoginRequestDto requestDto) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(requestDto.getEmail(), requestDto.getPassword())
    );

    User user = (User) authentication.getPrincipal();


    if (user != null) {
      if (!authentication.isAuthenticated()) {
        throw new IllegalArgumentException("User not authenticated");
      }
      String accessToken = jwtUtil.generateAccessToken(user.getEmail());
      String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

      userRepository.save(user);
      String userAgent = httpServletRequest.getHeader("User-Agent");
      String ipAddress = getClientIp(httpServletRequest);

      Session session = Session.builder()
          .user(user).refreshToken(refreshToken).userAgent(userAgent).ipAddress(ipAddress).provider(LoginProviderType.EMAIL).build();
      sessionRepository.save(session);

      return AuthResponseDto.builder()
          .accessToken(accessToken)
          .refreshToken(refreshToken)
          .build();
    }

    throw new RuntimeException("Invalid credentials");
  }

  @Override
  @Transactional
  public SignUpResponseDto signup(SignUpRequestDto request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Email already exists");
    }
    if (userRepository.existsByContact(request.getContact())) {
      throw new RuntimeException("Contact already exists");
    }

    Role role = roleRepository.findByRole(RoleEnum.ROLE_USER).orElseThrow(() -> new RuntimeException("Role not found"));

    User user = User.builder()
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .email(request.getEmail())
        .contact(request.getContact())
        .gender(request.getGender())
        .dateOfBirth(request.getDateOfBirth())
        .password(passwordEncoder.encode(request.getPassword()))
        .avatarUrl(request.getAvatarUrl())
        .providerType(LoginProviderType.EMAIL)
        .build();

    if (user.getRoles() == null) {
      user.setRoles(new HashSet<>());
    }
    user.getRoles().add(role);

    userRepository.save(user);

    emailUtil.sendUserWelcomeEmail(user.getEmail(), user.getFirstName(), user.getUserId());

    return SignUpResponseDto.builder()
        .userId(user.getUserId())
        .email(user.getEmail())
        .message("User registered successfully")
        .build();
  }

  @Transactional
  public void logout(String refreshToken) {
    Session session = sessionRepository.findByRefreshToken(refreshToken).orElse(null);
    assert session != null;
    session.setRevoked(false);
    sessionRepository.save(session);
    SecurityContextHolder.clearContext();
  }

  @Override
  public AuthResponseDto refresh(String refreshToken) {

  if(!jwtUtil.isTokenValid(refreshToken)) {
    throw new RuntimeException("Invalid refresh token");
  }
  if (!jwtUtil.isRefreshToken(refreshToken)) {
      throw new RuntimeException("Token is not refresh token");
  }

  Session session = sessionRepository.findByRefreshToken(refreshToken).orElseThrow(() ->
      new IllegalArgumentException("Refresh token not founded"));

  if (session.getRevoked()) {
    throw new RuntimeException("Refresh token has been revoked");
  }

  String email = jwtUtil.getUserEmailFromToken(refreshToken);
  String newAccessToken = jwtUtil.generateAccessToken(email);
  String newRefreshToken = jwtUtil.generateRefreshToken(email);

  session.setRefreshToken(newAccessToken);
    sessionRepository.save(session);

    return AuthResponseDto.builder()
        .refreshToken(newRefreshToken)
        .accessToken(newAccessToken)
        .build();
  }

//  Seller login


//  Helper method

  private String getClientIp(HttpServletRequest request) {
    String remoteAddr = request.getHeader("X-Forwarded-For");
    if (remoteAddr == null || remoteAddr.isEmpty()) {
      remoteAddr = request.getRemoteAddr();
    }
    return remoteAddr;
  }
}
