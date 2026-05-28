package com.omkashyap.com.backend.security;

import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtFilterChain extends OncePerRequestFilter {

  private final UserRepository userRepository;
  private final JwtUtil jwtUtil;

  @Override
  protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
    log.info(request.getRequestURI());

    final String requestTokenHeader = request.getHeader("Authorization");
    if (requestTokenHeader == null || !requestTokenHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      String token = requestTokenHeader.substring(7);

      String userEmail = jwtUtil.getUserEmailFromToken(token);

      if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not exists"));

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
      }
    } catch (Exception e) {
      log.error("JWT Error: {}", e.getMessage());
    }
    filterChain.doFilter(request, response);
  }
}
