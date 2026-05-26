package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.OtpRequestDto;
import com.omkashyap.com.backend.entity.Otp;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.OtpRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.service.OtpService;
import com.omkashyap.com.backend.util.AuthHeaderUtil;
import com.omkashyap.com.backend.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

  private final OtpRepository otpRepository;
  private final OtpUtil otpUtil;
  private final UserRepository userRepository;
  private final AuthHeaderUtil authHeaderUtil;

  public String generateOtp(String authHeader) {

    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);
    User user = userRepository.findByEmail(email).orElseThrow(() ->
        new IllegalArgumentException("User not found"));

    Otp latest = otpRepository
        .findTopByUserOrderByCreatedAtDesc(user)
        .orElse(null);

    if (latest != null &&
        latest.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(30))) {

      throw new IllegalArgumentException(
          "Please wait before requesting another OTP");
    }

    otpRepository.deleteAllByUser(user);

    String generatedOtp = otpUtil.generateOtp();

    Otp otp = Otp.builder()
        .otp(generatedOtp)
        .user(user)
        .build();

    otpRepository.save(otp);

    return "Otp sent successfully";
  }

  public void verifyOtp(String authHeader, OtpRequestDto requestDto) {

    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);

    Otp otp = otpRepository
        .findByUser_EmailAndVerifiedFalse(email)
        .orElseThrow(() ->
            new IllegalArgumentException("OTP not exists for user"));

    if (otp.isExpired()) {
      throw new IllegalArgumentException("OTP expired");
    }

    boolean isValid = otpUtil.decodeOtp(requestDto.getOtp(), otp.getOtp());

    if (isValid) otp.setVerified(true);
    else throw new IllegalArgumentException("Invalid OTP");
    otpRepository.save(otp);

  }

  @Scheduled(fixedRate = 600000)
  public void cleanupExpiredOtps() {
    otpRepository.deleteByValidUntilBefore(LocalDateTime.now());
  }
}