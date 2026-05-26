package com.omkashyap.com.backend.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
@RequiredArgsConstructor
@Slf4j
public class OtpUtil {

  private static final SecureRandom random = new SecureRandom();

  public String generateOtp() {
    int otp = 100000 + random.nextInt(900000);

    log.info("{}", otp);

    return encodeOtp(String.valueOf(otp));
  }

  public boolean decodeOtp(String otp, String hashedOtp) {
    return BCrypt.checkpw(otp, hashedOtp);
  }

  private String encodeOtp(String otp) {
    return BCrypt.hashpw(otp, BCrypt.gensalt());
  }

}
