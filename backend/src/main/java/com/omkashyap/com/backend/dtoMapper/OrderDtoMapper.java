package com.omkashyap.com.backend.dtoMapper;

import com.omkashyap.com.backend.dto.responseDto.OrderResponseDto;
import com.omkashyap.com.backend.entity.OrderItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderDtoMapper {

  public OrderResponseDto mapToDto(OrderItem orderItem) {
    OrderResponseDto dto = OrderResponseDto.builder()
        .orderId(orderItem.getOrderItemId())
        .quantity(orderItem.getQuantity())
        .amount(orderItem.getAmount())
        .coins(orderItem.getCoins())
        .productUrl(orderItem.getProduct().getProductUrl())
        .productId(orderItem.getProduct().getProductId())
        .orderStatus(orderItem.getStatus().getOrderStatus())
        .createdAt(orderItem.getCreatedAt())
        .confirmedAt(orderItem.getStatus().getConfirmedAt())
        .processedAt(orderItem.getStatus().getProcessedAt())
        .shippedAt(orderItem.getStatus().getShippedAt())
        .outOfDeliveryAt(orderItem.getStatus().getConfirmedAt())
        .deliveredAt(orderItem.getStatus().getDeliveredAt())
        .cancelledAt(orderItem.getStatus().getCancelledAt())
        .returnedAt(orderItem.getStatus().getReturnedAt())
        .exchangedAt(orderItem.getStatus().getExchangedAt())
        .build();

    Map<String, String> attributes = new HashMap<>();
    orderItem.getProductAttributes().forEach(
        attr -> attributes.put(
            attr.getAttributeName(),
            attr.getAttributeValue()
        )
    );

    dto.setSelectedAttributes(attributes);

    return dto;
  }


}
