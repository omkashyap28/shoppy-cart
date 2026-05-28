package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.PaymentRequestDto;
import com.omkashyap.com.backend.dto.requestDto.PaymentUpdateRequestDto;
import com.omkashyap.com.backend.dto.responseDto.PaymentResponseDto;
import com.omkashyap.com.backend.dtoMapper.PaymentDtoMapper;
import com.omkashyap.com.backend.entity.*;
import com.omkashyap.com.backend.repository.*;
import com.omkashyap.com.backend.service.PaymentService;
import com.omkashyap.com.backend.type.OrderStatusEnum;
import com.omkashyap.com.backend.type.PaymentMethodEnum;
import com.omkashyap.com.backend.type.PaymentStatusEnum;
import com.omkashyap.com.backend.util.EmailUtil;
import com.omkashyap.com.backend.util.PaymentUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {
  private final OrderStatusRepository orderStatusRepository;
  private final ProductRepository productRepository;
  private final InvoiceRepository invoiceRepository;
  private final EmailUtil emailUtil;
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

    Invoice invoice = Invoice.builder()
        .orderItem(orderItem)
        .user(orderItem.getOrder().getUser())
        .billingAddress(orderItem.getAddress())
        .payment(payment)
        .build();

    invoiceRepository.save(invoice);

    orderItem.setPayments(payment);
    orderItemRepository.save(orderItem);

    if (payment.getPaymentStatus().equals(PaymentStatusEnum.SUCCESS)) {
      Product product = productRepository.findByProductId(orderItem.getProduct().getProductId()).orElse(null);
      if (product != null) {
        product.setTotalEarning(product.getTotalEarning().add(BigDecimal.valueOf(product.getPrice() * orderItem.getQuantity())));
        paymentRepository.save(payment);
      }
    }
    OrderStatus orderStatus = orderStatusRepository.findByOrderItem_OrderItemId(orderItem.getOrderItemId()).orElse(null);
    assert orderStatus != null;

    if (payment.getPaymentStatus().equals(PaymentStatusEnum.SUCCESS)) {
      orderStatus.setOrderStatus(OrderStatusEnum.CONFIRMED);
      emailUtil.sendOrderConfirmationEmail(
          orderItem.getOrder().getUser().getEmail(),
          orderItem.getOrderItemId(),
          ""
      );
    } else if (payment.getPaymentStatus().equals(PaymentStatusEnum.FAILED)) {
      orderStatus.setOrderStatus(OrderStatusEnum.CANCELLED);
      emailUtil.sendOrderCancellationEmail(
          orderItem.getOrder().getUser().getEmail(),
          orderItem.getOrderItemId()
      );
    } else {
      if (payment.getPaymentMethod().equals(PaymentMethodEnum.PAY_ON_DELIVERY)) {
        orderStatus.setOrderStatus(OrderStatusEnum.CONFIRMED);
        emailUtil.sendOrderConfirmationEmail(
            orderItem.getOrder().getUser().getEmail(),
            orderItem.getOrderItemId(),
            ""
        );
      }
    }
    orderStatusRepository.save(orderStatus);

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
