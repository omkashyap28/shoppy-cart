package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.LoginRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SignUpRequestDto;
import com.omkashyap.com.backend.dto.responseDto.LoginResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SignUpResponseDto;
import com.omkashyap.com.backend.entity.Role;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.RoleRepository;
import com.omkashyap.com.backend.repository.SessionRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.security.JwtUtil;
import com.omkashyap.com.backend.service.AuthService;
import com.omkashyap.com.backend.service.SessionService;
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

import java.time.LocalDateTime;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final SessionRepository sessionRepository;
  private final SessionService sessionService;
  private final RoleRepository roleRepository;
  private String token;
  @Autowired
  private HttpServletRequest httpServletRequest;
  private final EmailUtil emailUtil;

  @Override
  @Transactional
  public LoginResponseDto login(LoginRequestDto loginRequestDto) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
    );

    User user = (User) authentication.getPrincipal();


    if (user != null) {
      if (authentication.isAuthenticated()) {
        token = jwtUtil.generateAccessToken(user.getEmail());
      }
      userRepository.save(user);
      String userAgent = httpServletRequest.getHeader("User-Agent");
      String ipAddress = getClientIp(httpServletRequest);
      sessionService.createSession(user, token, LocalDateTime.now().plusDays(1), userAgent, ipAddress, LoginProviderType.EMAIL);
      return new LoginResponseDto(token);
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
  public void logout(String token) {
    sessionRepository.deleteByAccessToken(token);
    SecurityContextHolder.clearContext();
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
