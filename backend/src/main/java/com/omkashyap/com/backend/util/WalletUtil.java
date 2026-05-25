package com.omkashyap.com.backend.util;

import com.omkashyap.com.backend.entity.UserWallet;
import com.omkashyap.com.backend.repository.UserWalletRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class WalletUtil {

  private final UserWalletRepository userWalletRepository;

  public WalletUtil(UserWalletRepository userWalletRepository) {
    this.userWalletRepository = userWalletRepository;
  }

  public String encodeMPin(int mPin) {
    return BCrypt.hashpw(String.valueOf(mPin), BCrypt.gensalt());
  }

  public Boolean compareMPin(int mPin, String encodedMPin) {
    return BCrypt.checkpw(String.valueOf(mPin), encodedMPin);
  }

  public void lockAccount(UserWallet userWallet) {
    if (userWallet.getIsLocked().equals(false) &&
        userWallet.getLockedUntil() == null) {
      userWallet.setIsLocked(true);
      userWallet.setLockedUntil(LocalDateTime.now());

      userWalletRepository.save(userWallet);
    }
  }

  public void unlockAccount(UserWallet userWallet) {
    if (userWallet.getLockedUntil() != null
        && userWallet.getLockedUntil().isBefore(LocalDateTime.now())) {
      userWallet.setInvalidAttempts(0);
      userWallet.setLockedUntil(null);

      userWalletRepository.save(userWallet);
    }
  }
}
