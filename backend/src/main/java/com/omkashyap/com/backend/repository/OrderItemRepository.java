package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

  List<OrderItem> findAllByOrderIdOrderByCreatedAtDesc(Long id);

  Optional<OrderItem> findByOrderItemId(String orderItemId);
}
