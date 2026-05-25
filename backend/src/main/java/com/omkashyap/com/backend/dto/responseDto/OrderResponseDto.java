package com.omkashyap.com.backend.dto.responseDto;

import com.omkashyap.com.backend.type.OrderStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDto {

  private String orderId;
  private Integer quantity;
  private Double amount;
  private Integer coins;
  private String productUrl;
  private String productId;
  private Map<String, String> selectedAttributes;
  private OrderStatusEnum orderStatus;
  private LocalDateTime createdAt;
  private LocalDateTime confirmedAt;
  private LocalDateTime processedAt;
  private LocalDateTime shippedAt;
  private LocalDateTime outOfDeliveryAt;
  private LocalDateTime deliveredAt;
  private LocalDateTime cancelledAt;
  private LocalDateTime returnedAt;
  private LocalDateTime exchangedAt;
}
