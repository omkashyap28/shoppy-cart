package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Otp;
import com.omkashyap.com.backend.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {

  Optional<Otp> findTopByUserOrderByCreatedAtDesc(User user);

  @Transactional
  void deleteByValidUntilBefore(LocalDateTime time);

  @Transactional
  void deleteAllByUser(User user);

  Optional<Otp> findByUser_EmailAndVerifiedFalse(String email);
}