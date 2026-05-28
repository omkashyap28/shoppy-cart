package com.omkashyap.com.backend.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@Slf4j
public class WebSecurityConfiguration {

  private final JwtFilterChain jwtFilterChain;
  private final OAuth2SuccessHandler auth2SuccessHandler;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) {
    return httpSecurity
        .authorizeHttpRequests(auth ->
            auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/search/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/user/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/seller/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/product/**").permitAll()
                .requestMatchers("/user/**").hasRole("USER")
                .requestMatchers("/wallet/**").hasRole("USER")
                .requestMatchers("/seller/**").hasRole("SELLER")
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
        )
        .formLogin(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .csrf(AbstractHttpConfigurer::disable)
        .addFilterBefore(jwtFilterChain, UsernamePasswordAuthenticationFilter.class)
        .oauth2Login(oauth ->
            oauth
                .successHandler(auth2SuccessHandler)
                .failureHandler((req, res, ex) -> {
                  log.error("OAuth2 error: {}", ex.getMessage());
                })

        )
        .build();
  }

}
