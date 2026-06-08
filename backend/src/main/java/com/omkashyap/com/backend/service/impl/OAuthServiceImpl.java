package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.responseDto.AuthResponseDto;
import com.omkashyap.com.backend.entity.Role;
import com.omkashyap.com.backend.entity.Session;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.RoleRepository;
import com.omkashyap.com.backend.repository.SessionRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.security.JwtUtil;
import com.omkashyap.com.backend.service.OAuthService;
import com.omkashyap.com.backend.type.LoginProviderType;
import com.omkashyap.com.backend.type.RoleEnum;
import com.omkashyap.com.backend.util.AuthUtil;
import com.omkashyap.com.backend.util.EmailUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuthServiceImpl implements OAuthService {

  private final AuthUtil authUtil;
  private final UserRepository userRepository;
  private final JwtUtil jwtUtil;
  private final HttpServletRequest httpServletRequest;
  private final RoleRepository roleRepository;
  private final EmailUtil emailUtil;
  private final SessionRepository sessionRepository;

  @Override
  public AuthResponseDto handleOAuth2LoginRequest(OAuth2User oAuth2User, String registrationId) {
    LoginProviderType providerType = authUtil.getLoginProviderFromRegistrationId(registrationId);

    String providerId = authUtil.determineProviderTypeFromOAuth2User(oAuth2User, registrationId);

    String email = oAuth2User.getAttribute("email");
    String firstName = oAuth2User.getAttribute("given_name");
    String lastName = oAuth2User.getAttribute("family_name");
    String avatar = oAuth2User.getAttribute("picture");

    if (email == null) {
      throw new IllegalArgumentException("Email is not provided by OAuth provider");
    }

    if (firstName == null)
      firstName = "User";
    if (lastName == null)
      lastName = "";

    User userByProvider = userRepository
        .findByProviderIdAndProviderType(providerId, providerType)
        .orElse(null);

    User userByEmail = userRepository
        .findByEmail(email)
        .orElse(null);

    Role role = roleRepository.findByRole(RoleEnum.ROLE_USER).orElseThrow(() -> new RuntimeException("Role not found"));

    User finalUser;

    if (userByProvider == null && userByEmail == null) {
      User newUser = User.builder()
          .email(email)
          .firstName(firstName)
          .lastName(lastName)
          .providerId(providerId)
          .providerType(providerType)
          .password(null)
          .avatarUrl(avatar)
          .build();

      newUser.getRoles().add(role);

      finalUser = userRepository.save(newUser);
    } else if (userByProvider == null) {
      userByEmail.setProviderId(providerId);

      finalUser = userRepository.save(userByEmail);
    } else {
      throw new IllegalArgumentException("Invalid OAuth state");
    }
    emailUtil.sendUserWelcomeEmail(
        finalUser.getEmail(),
        finalUser.getFirstName(),
        finalUser.getUserId());

    String accessToken = jwtUtil.generateAccessToken(finalUser.getEmail());
    String refreshToken = jwtUtil.generateRefreshToken(finalUser.getEmail());
    String userAgent = httpServletRequest.getHeader("User-Agent");
    String ipAddress = getClientIp(httpServletRequest);

    Session session = Session.builder()
        .user(finalUser)
        .refreshToken(refreshToken)
        .userAgent(userAgent)
        .ipAddress(ipAddress)
        .provider(LoginProviderType.GOOGLE)
        .build();

    sessionRepository.save(session);

    return AuthResponseDto.builder()
        .refreshToken(refreshToken)
        .accessToken(accessToken)
        .build();
  }

  private String getClientIp(HttpServletRequest request) {
    String remoteAddr = request.getHeader("X-Forwarded-For");
    if (remoteAddr == null || remoteAddr.isEmpty()) {
      remoteAddr = request.getRemoteAddr();
    }
    return remoteAddr;
  }
}
