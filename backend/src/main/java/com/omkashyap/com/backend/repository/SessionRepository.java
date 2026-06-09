package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
  Optional<Session> findByRefreshToken(String refreshToken);

  Optional<Session> findByUser_UserId(String userId);

}
