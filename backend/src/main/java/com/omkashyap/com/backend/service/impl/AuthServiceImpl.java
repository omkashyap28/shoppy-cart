package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.LoginRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ResetPasswordRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SignUpRequestDto;
import com.omkashyap.com.backend.dto.responseDto.AuthResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ResetPasswordResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SessionResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SignUpResponseDto;
import com.omkashyap.com.backend.entity.*;
import com.omkashyap.com.backend.repository.*;
import com.omkashyap.com.backend.security.JwtUtil;
import com.omkashyap.com.backend.service.AuthService;
import com.omkashyap.com.backend.type.LoginProviderType;
import com.omkashyap.com.backend.type.RoleEnum;
import com.omkashyap.com.backend.util.EmailUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final SessionRepository sessionRepository;
  private final RoleRepository roleRepository;
  private final HttpServletRequest httpServletRequest;
  private final EmailUtil emailUtil;
  private final SellerRepository sellerRepository;
  private final AffiliateUserRepository affiliateUserRepository;

  @Override
  @Transactional
  public AuthResponseDto login(LoginRequestDto requestDto) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(requestDto.getEmail(), requestDto.getPassword()));

    User user = (User) authentication.getPrincipal();

    if (user != null) {
      if (!authentication.isAuthenticated()) {
        throw new IllegalArgumentException("User not authenticated");
      }

      List<String> roles = user.getRoles().stream()
          .map(role -> role.getRole().name())
          .toList();

      String accessToken = jwtUtil.generateAccessToken(user.getEmail());
      String refreshToken = jwtUtil.generateRefreshToken(user.getEmail(), roles);

      userRepository.save(user);
      String userAgent = httpServletRequest.getHeader("User-Agent");
      String ipAddress = getClientIp(httpServletRequest);
      String deviceId = resolveDeviceId(httpServletRequest);

      Session session = sessionRepository.findByUser_UserIdAndDeviceId(user.getUserId(), deviceId).orElse(null);

      if (session != null) {
        session.setRefreshToken(refreshToken);
        session.setUserAgent(userAgent);
        session.setRevoked(false);
        sessionRepository.save(session);
      } else {
        Session newSession = Session.builder()
            .user(user).refreshToken(refreshToken).userAgent(userAgent).ipAddress(ipAddress).deviceId(deviceId)
            .provider(LoginProviderType.EMAIL).build();
        sessionRepository.save(newSession);
      }

      Seller seller = sellerRepository.findByUser_UserId(user.getUserId()).orElse(null);
      AffiliateUser affiliateUser = affiliateUserRepository.findByUser_UserId(user.getUserId()).orElse(null);

      return AuthResponseDto.builder()
          .accessToken(accessToken)
          .refreshToken(refreshToken)
          .deviceId(deviceId)
          .userId(user.getUserId())
          .email(user.getEmail())
          .sellerId(seller != null ? seller.getSellerId() : null)
          .affiliateCode(affiliateUser != null ? affiliateUser.getAffiliateCode() : null)
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
    // if (userRepository.existsByContact(request.getContact())) {
    // throw new RuntimeException("Contact already exists");
    // }

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
    session.setRevoked(true);
    sessionRepository.save(session);
    SecurityContextHolder.clearContext();
  }

  @Override
  public AuthResponseDto refresh(String refreshToken) {

    if (!jwtUtil.isTokenValid(refreshToken)) {
      throw new RuntimeException("Invalid refresh token");
    }
    if (!jwtUtil.isRefreshToken(refreshToken)) {
      throw new RuntimeException("Token is not refresh token");
    }

    if (jwtUtil.isTokenExpired(refreshToken)) {
      throw new RuntimeException("Token is expired");
    }

    Session session = sessionRepository.findByRefreshToken(refreshToken)
        .orElseThrow(() -> new IllegalArgumentException("Refresh token not founded"));

    if (session.getRevoked()) {
      throw new RuntimeException("Refresh token has been revoked");
    }

    Seller seller = sellerRepository.findByUser_UserId(session.getUser().getUserId()).orElse(null);
    AffiliateUser affiliateUser = affiliateUserRepository.findByUser_UserId(session.getUser().getUserId()).orElse(null);
        
    String email = jwtUtil.getUserEmailFromToken(refreshToken);
    List<String> roles = jwtUtil.getRoles(refreshToken);
    String newAccessToken = jwtUtil.generateAccessToken(email);
    String newRefreshToken = jwtUtil.generateRefreshToken(email, roles);

    session.setRefreshToken(newRefreshToken);
    sessionRepository.save(session);

    User user = session.getUser();

    return AuthResponseDto.builder()
        .refreshToken(newRefreshToken)
        .accessToken(newAccessToken)
        .userId(user.getUserId())
        .email(user.getEmail())
        .sellerId(seller != null ? seller.getSellerId() : null)
        .affiliateCode(affiliateUser != null ? affiliateUser.getAffiliateCode() : null)
        .build();
  }

  @Override
  public ResetPasswordResponseDto resetPassword(String email, ResetPasswordRequestDto requestDto) {
    User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not exists"));

    boolean isPasswordMatched = passwordEncoder.matches(requestDto.getPassword(), user.getPassword());
    if (!isPasswordMatched) {
      throw new IllegalArgumentException("Invalid password");
    }
    user.setPassword(passwordEncoder.encode(requestDto.getNewPassword()));
    userRepository.save(user);

    return ResetPasswordResponseDto.builder()
        .message("Password reset successfully")
        .build();
  }

  @Override
  public void logoutAllSessions(String email) {
    List<Session> sessions = sessionRepository.findAllByUser_Email(email);

    sessions.forEach(item -> {
      item.setRevoked(true);
      sessionRepository.save(item);
    });
  }

  @Override
  public void logoutSessionBySessionId(String email, String sessionId) {
    Session session = sessionRepository.findByUser_EmailAndSessionId(email, sessionId)
        .orElseThrow(() -> new IllegalArgumentException("Session not exits"));
    session.setRevoked(true);
    sessionRepository.save(session);
  }

  @Override
  public List<SessionResponseDto> getAllActiveSessions(String email, String deviceId) {
    List<Session> sessions = sessionRepository.findAllByUser_Email(email);

    log.info(deviceId);

    return sessions.stream().map(session -> SessionResponseDto.builder().sessionId(session.getSessionId())
        .deviceInformation(session.getUserAgent())
        .isCurrent(session.getDeviceId().equals(deviceId))
        .isActive(!session.getRevoked())
        .build()).toList();
  }

  // Helper method

  private String getClientIp(HttpServletRequest request) {
    String remoteAddr = request.getHeader("X-Forwarded-For");
    if (remoteAddr == null || remoteAddr.isEmpty()) {
      remoteAddr = request.getRemoteAddr();
    }
    return remoteAddr;
  }

  private String resolveDeviceId(HttpServletRequest request) {
    String deviceId = Arrays.stream(request.getCookies() != null ? request.getCookies() : new Cookie[0])
        .filter(c -> "shoppyDeviceId".equals(c.getName()))
        .map(Cookie::getValue)
        .findFirst()
        .orElse(null);

    if (deviceId == null) {
      deviceId = UUID.randomUUID().toString();
    }

    return deviceId;
  }
}
