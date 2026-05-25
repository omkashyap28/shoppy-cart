package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
  Optional<Payment> findByPaymentId(String paymentId);
}