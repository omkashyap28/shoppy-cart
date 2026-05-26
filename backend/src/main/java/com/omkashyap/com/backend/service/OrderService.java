package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.OrderRequestDto;
import com.omkashyap.com.backend.dto.responseDto.OrderResponseDto;

import java.util.List;

public interface OrderService {

  OrderResponseDto placeNewOrder(String authHeader, String productId, String refId, OrderRequestDto requestDto);

  List<OrderResponseDto> getUserAllOrders(String userId);

  OrderResponseDto getUserOrdersByOrderId(String userId, String orderId);

  OrderResponseDto cancelUserOrdersByOrderId(String userId, String orderId);

  OrderResponseDto exchangeUserOrdersByOrderId(String userId, String orderId);

  OrderResponseDto returnUserOrdersByOrderId(String userId, String orderId);
}
