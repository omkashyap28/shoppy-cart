package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {
  Optional<OrderStatus> findByOrderItem_OrderItemId(String orderItemId);
}
