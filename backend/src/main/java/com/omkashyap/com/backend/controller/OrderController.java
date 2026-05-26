package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.responseDto.OrderResponseDto;
import com.omkashyap.com.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/{userId}/orders")
public class OrderController {

  private final OrderService orderService;

  @GetMapping
  ResponseEntity<List<OrderResponseDto>> getUserAllOrders(@PathVariable String userId) {
    return ResponseEntity.status(HttpStatus.OK).body(orderService.getUserAllOrders(userId));
  }

  @GetMapping("/{orderId}")
  ResponseEntity<OrderResponseDto> getUserOrdersByOrderId(@PathVariable String userId, @PathVariable String orderId) {
    return ResponseEntity.status(HttpStatus.OK).body(orderService.getUserOrdersByOrderId(userId, orderId));
  }

  @PatchMapping("/cancellation")
  ResponseEntity<OrderResponseDto> cancelUserOrdersByOrderId(@PathVariable String userId, @Param("orderId") String orderId) {
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(orderService.cancelUserOrdersByOrderId(userId, orderId));
  }

  @PatchMapping("/return")
  ResponseEntity<OrderResponseDto> returnUserOrdersByOrderId(@PathVariable String userId, @Param("orderId") String orderId) {
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(orderService.returnUserOrdersByOrderId(userId, orderId));
  }

  @PatchMapping("/exchange")
  ResponseEntity<OrderResponseDto> exchangeUserOrdersByOrderId(@PathVariable String userId, @Param("orderId") String orderId) {
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(orderService.exchangeUserOrdersByOrderId(userId, orderId));
  }

}
