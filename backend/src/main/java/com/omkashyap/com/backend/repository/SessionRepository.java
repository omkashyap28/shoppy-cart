package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
  Optional<Session> findByRefreshToken(String refreshToken);

  Optional<Session> findByUser_UserId(String userId);

  Optional<Session> findByUser_EmailAndSessionId(String userId, String sessionId);

  Optional<Session> findByUser_UserIdAndDeviceId(String userId, String deviceId);

  List<Session> findAllByUser_Email(String email);
}
