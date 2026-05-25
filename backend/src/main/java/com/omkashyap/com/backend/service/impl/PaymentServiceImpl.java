package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.PaymentRequestDto;
import com.omkashyap.com.backend.dto.requestDto.PaymentUpdateRequestDto;
import com.omkashyap.com.backend.dto.responseDto.PaymentResponseDto;
import com.omkashyap.com.backend.dtoMapper.PaymentDtoMapper;
import com.omkashyap.com.backend.entity.OrderItem;
import com.omkashyap.com.backend.entity.Payment;
import com.omkashyap.com.backend.repository.OrderItemRepository;
import com.omkashyap.com.backend.repository.PaymentRepository;
import com.omkashyap.com.backend.service.PaymentService;
import com.omkashyap.com.backend.type.PaymentMethodEnum;
import com.omkashyap.com.backend.type.PaymentStatusEnum;
import com.omkashyap.com.backend.util.PaymentUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

  private final PaymentRepository paymentRepository;
  private final PaymentDtoMapper paymentDtoMapper;
  private final OrderItemRepository orderItemRepository;
  private final PaymentUtil paymentUtil;

  @Override
  public PaymentResponseDto makePayment(PaymentRequestDto requestDto) {
    OrderItem orderItem = orderItemRepository.findByOrderItemId(requestDto.getOrderId()).orElseThrow(() ->
        new IllegalArgumentException("Order not exists with this id")
    );

    Payment payment;

    if (requestDto.getPaymentMethod().equals(PaymentMethodEnum.UPI)) {
      payment = paymentUtil.createUpiPayment(orderItem);
    } else if (requestDto.getPaymentMethod().equals(PaymentMethodEnum.WALLET)) {
      payment = paymentUtil.createWalletPayment(orderItem);
    } else if (requestDto.getPaymentMethod().equals(PaymentMethodEnum.PAY_ON_DELIVERY)) {
      payment = paymentUtil.createPayOnDeliveryPayment(orderItem);
    } else {
      throw new IllegalArgumentException("Payment method not supported");
    }

    payment.setTransactionId(paymentUtil.generateTransactionId());

    paymentRepository.save(payment);

    orderItem.setPayments(payment);
    orderItemRepository.save(orderItem);

    return paymentDtoMapper.mapToDto(payment);
  }

  @Override
  public PaymentResponseDto getPaymentByPaymentId(String paymentId) {
    Payment payment = paymentRepository.findByPaymentId(paymentId).orElseThrow(() ->
        new IllegalArgumentException("No payment founded"));

    return paymentDtoMapper.mapToDto(payment);
  }

  @Override
  public PaymentResponseDto updatePaymentByPaymentId(String paymentId, PaymentUpdateRequestDto requestDto) {
    Payment payment = paymentRepository.findByPaymentId(paymentId).orElseThrow(() -> new IllegalArgumentException("No payment founded"));

    if (!payment.getPaymentMethod().equals(PaymentMethodEnum.PAY_ON_DELIVERY)) {
      throw new IllegalArgumentException("Payment already done or Payment method not accepted");
    }

    if (requestDto.getPaymentMethod().equals(PaymentMethodEnum.UPI)) {
      payment.setPaymentMethod(PaymentMethodEnum.UPI);
      payment.setPaymentStatus(PaymentStatusEnum.SUCCESS);
    } else if (requestDto.getPaymentMethod().equals(PaymentMethodEnum.CASH)) {
      payment.setPaymentMethod(PaymentMethodEnum.CASH);
      payment.setPaymentStatus(PaymentStatusEnum.SUCCESS);
    } else {
      throw new IllegalArgumentException("Payment method not supported");
    }

    Payment savedPayment = paymentRepository.save(payment);

    return paymentDtoMapper.mapToDto(savedPayment);
  }

}
