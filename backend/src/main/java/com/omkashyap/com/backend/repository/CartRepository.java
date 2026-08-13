package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
  Optional<Cart> findByUser_UserId(String userId);

}