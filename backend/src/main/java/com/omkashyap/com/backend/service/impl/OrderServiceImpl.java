package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.OrderRequestDto;
import com.omkashyap.com.backend.dto.responseDto.OrderResponseDto;
import com.omkashyap.com.backend.dtoMapper.OrderDtoMapper;
import com.omkashyap.com.backend.entity.*;
import com.omkashyap.com.backend.repository.*;
import com.omkashyap.com.backend.service.OrderService;
import com.omkashyap.com.backend.type.OrderStatusEnum;
import com.omkashyap.com.backend.type.PaymentMethodEnum;
import com.omkashyap.com.backend.type.PaymentStatusEnum;
import com.omkashyap.com.backend.util.AffiliateUtil;
import com.omkashyap.com.backend.util.AuthHeaderUtil;
import com.omkashyap.com.backend.util.EmailUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

  private final OrderItemRepository orderItemRepository;
  private final UserRepository userRepository;
  private final ProductRepository productRepository;
  private final OrdersRepository ordersRepository;
  private final ProductAttributeRepository productAttributeRepository;
  private final OrderDtoMapper orderDtoMapper;
  private final OrderStatusRepository orderStatusRepository;
  private final AddressRepository addressRepository;
  private final AuthHeaderUtil authHeaderUtil;
  private final AffiliateUserProductRepository affiliateUserProductRepository;
  private final AffiliateUtil affiliateUtil;
  private final EmailUtil emailUtil;
  private final UserWalletRepository userWalletRepository;

  @Override
  @Transactional
  public OrderResponseDto placeNewOrder(
      String authHeader,
      String productId,
      String refId,
      OrderRequestDto requestDto
  ) {
    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);
    User user = userRepository.findByEmail(email).orElseThrow(() ->
        new IllegalArgumentException("User not exists")
    );

    Address address = addressRepository.findByAddressId(requestDto.getAddressId()).orElseThrow(() ->
        new IllegalArgumentException("This Address is not exists for user"));

    Product product = productRepository.findByProductId(productId).orElseThrow(() ->
        new IllegalArgumentException("Product not exists")
    );

    if (product.getQuantity() < requestDto.getQuantity()) {
      throw new IllegalArgumentException("Selected quantity for product not available");
    }

    Orders orders = ordersRepository.findByUser_UserId(user.getUserId()).orElseGet(() -> Orders.builder()
        .user(user)
        .build());
    ordersRepository.save(orders);

    OrderItem orderItem = OrderItem.builder()
        .order(orders)
        .product(product)
        .address(address)
        .payments(null)
        .invoice(null)
        .quantity(requestDto.getQuantity())
        .amount(product.getPrice().doubleValue() * requestDto.getQuantity())
        .coins(product.getCoins() * requestDto.getQuantity())
        .build();

    if (requestDto.getSelectedAttributes() != null && !requestDto.getSelectedAttributes().isEmpty()) {
      List<ProductAttribute> matchedAttributes = product.getProductAttributes().stream()
          .filter(attr -> {
            String selectedValue = requestDto.getSelectedAttributes().get(attr.getAttributeName());
            productAttributeRepository.save(attr);
            return selectedValue != null && selectedValue.equals(attr.getAttributeValue());
          }).toList();

      orderItem.setProductAttributes(matchedAttributes);
    }
    orderItemRepository.save(orderItem);

    if (orders.getItems() == null) orders.setItems(new ArrayList<>());
    orders.getItems().add(orderItem);

    OrderStatus orderStatus = OrderStatus.builder()
        .orderItem(orderItem)
        .orderStatus(OrderStatusEnum.CREATED)
        .build();

    orderItem.setStatus(orderStatus);

    product.setQuantity(product.getQuantity() - requestDto.getQuantity());
    productRepository.save(product);

    if (refId != null) {
      AffiliateUserProduct affiliateUserProduct = affiliateUserProductRepository.
          findByAffiliateUser_AffiliateCode(refId).orElse(null);

      if (affiliateUserProduct != null) {
        affiliateUserProduct.increaseConversion();
        affiliateUserProduct.setTotalEarnings(
            affiliateUserProduct.getTotalEarnings().add(
                affiliateUtil.getTotalEarning(
                    orderItem.getAmount(),
                    product.getAffiliateCommission().getCommissionPercentage()
                )
            ));
        affiliateUserProductRepository.save(affiliateUserProduct);
      }
    }

    return orderDtoMapper.mapToDto(orderItem);
  }

  @Override
  public List<OrderResponseDto> getUserAllOrders(String userId) {

    Orders order = ordersRepository.findByUser_UserId(userId).orElse(null);
    if (order == null) {
      return List.of();
    }
    List<OrderItem> orderItems = orderItemRepository.findAllByOrderIdOrderByCreatedAtDesc(order.getId());

    return orderItems.stream().map(orderDtoMapper::mapToDto).toList();
  }

  @Override
  public OrderResponseDto getUserOrdersByOrderId(String userId, String orderId) {
    boolean isExists = userRepository.existsByUserId(userId);
    if (!isExists) throw new IllegalArgumentException("User not exists");

    OrderItem orderItem = orderItemRepository.findByOrderItemId(orderId).orElseThrow(() ->
        new IllegalArgumentException("Order not exists with this id")
    );

    return orderDtoMapper.mapToDto(orderItem);
  }

  @Override
  @Transactional
  public OrderResponseDto cancelUserOrdersByOrderId(String userId, String orderId) {
    OrderItem orderItem = orderItemRepository.findByOrderItemId(orderId).orElseThrow(() ->
        new IllegalArgumentException("Order not exists with this id")
    );

    if (!orderItem.getOrder().getUser().getUserId().equals(userId)) {
      throw new RuntimeException("User doesn't own to cancel this product");
    }

    OrderStatusEnum currentStatus = orderItem.getStatus().getOrderStatus();
    boolean isCancellable = currentStatus == OrderStatusEnum.CREATED ||
        currentStatus == OrderStatusEnum.PROCESSING ||
        currentStatus == OrderStatusEnum.CONFIRMED;

    if (!isCancellable) throw new RuntimeException("Order cancellation is not available");

    OrderStatus orderStatus = orderStatusRepository.findById(orderItem.getStatus().getId()).orElseThrow(() ->
        new IllegalArgumentException("Order not exists"));
    orderStatus.setOrderStatus(OrderStatusEnum.CANCELLED);
    orderStatus.setCancelledAt(LocalDateTime.now());
    orderStatusRepository.save(orderStatus);

    orderItemRepository.save(orderItem);
    Product product = productRepository.findByProductId(orderItem.getProduct().getProductId()).orElse(null);
    if (product != null) {
      product.setReturnCount(product.getReturnCount() + 1);
      productRepository.save(product);
    }
    if (orderItem.getStatus().getOrderStatus().equals(OrderStatusEnum.CANCELLED)) {
      if (orderItem.getPayments() != null && orderItem.getPayments().getPaymentMethod() == PaymentMethodEnum.WALLET) {
        if (orderItem.getPayments().getPaymentStatus() == PaymentStatusEnum.SUCCESS) {
          UserWallet wallet = userWalletRepository.
              findByUser_Email(orderItem.getOrder().getUser().getEmail()).orElse(null);
          if (wallet != null) {
            wallet.setCoins(wallet.getCoins() + orderItem.getPayments().getCoins());
            wallet.setTotalCredits(wallet.getTotalCredits() + orderItem.getPayments().getCoins());
            userWalletRepository.save(wallet);
          }
        }
      }
    }

    emailUtil.sendOrderCancellationEmail(
        orderItem.getOrder().getUser().getEmail(),
        orderItem.getOrderItemId()
    );

    return orderDtoMapper.mapToDto(orderItem);
  }

  @Override
  public OrderResponseDto exchangeUserOrdersByOrderId(String userId, String orderId) {
    OrderItem orderItem = orderItemRepository.findByOrderItemId(orderId).orElseThrow(() ->
        new IllegalArgumentException("Order not exists with this id")
    );

    if (orderItem.getCreatedAt().plusDays(7).isBefore(LocalDateTime.now())) {
      throw new IllegalArgumentException("Exchange not available");
    }

    if (!orderItem.getOrder().getUser().getUserId().equals(userId)) {
      throw new RuntimeException("User doesn't own to cancel this product");
    }

    OrderStatusEnum currentStatus = orderItem.getStatus().getOrderStatus();
    boolean isExchangeable = currentStatus == OrderStatusEnum.DELIVERED;

    if (!isExchangeable) throw new RuntimeException("Product exchange not available");

    OrderStatus orderStatus = orderStatusRepository.findById(orderItem.getStatus().getId()).orElseThrow(() ->
        new IllegalArgumentException("Order not exists"));
    orderStatus.setOrderStatus(OrderStatusEnum.EXCHANGE_REQUEST);
    orderStatus.setExchangedAt(LocalDateTime.now());
    orderStatusRepository.save(orderStatus);
    Product product = productRepository.findByProductId(orderItem.getProduct().getProductId()).orElse(null);
    if (product != null) {
      product.setExchangeCount(product.getExchangeCount() + 1);
      productRepository.save(product);
    }

    emailUtil.sendOrderExchangeRequestEmail(
        orderItem.getOrder().getUser().getEmail(),
        orderItem.getOrderItemId(),
        ""
    );

    return orderDtoMapper.mapToDto(orderItem);
  }

  @Override
  @Transactional
  public OrderResponseDto returnUserOrdersByOrderId(String userId, String orderId) {
    OrderItem orderItem = orderItemRepository.findByOrderItemId(orderId).orElseThrow(() ->
        new IllegalArgumentException("Order not exists with this id")
    );

    if (orderItem.getCreatedAt().plusDays(7).isBefore(LocalDateTime.now())) {
      throw new IllegalArgumentException("Return not available");
    }

    if (!orderItem.getOrder().getUser().getUserId().equals(userId)) {
      throw new RuntimeException("User doesn't own to cancel this product");
    }

    OrderStatusEnum currentStatus = orderItem.getStatus().getOrderStatus();
    boolean isReturnable = currentStatus == OrderStatusEnum.DELIVERED;

    if (!isReturnable) throw new RuntimeException("Product return not available");

    OrderStatus orderStatus = orderStatusRepository.findById(orderItem.getStatus().getId()).orElseThrow(() ->
        new IllegalArgumentException("Order not exists"));

    orderStatus.setOrderStatus(OrderStatusEnum.RETURN_REQUEST);
    orderStatus.setReturnedAt(LocalDateTime.now());
    orderStatusRepository.save(orderStatus);

    emailUtil.sendOrderReturnRequestEmail(
        orderItem.getOrder().getUser().getEmail(),
        orderItem.getOrderItemId(),
        ""
    );

    return orderDtoMapper.mapToDto(orderItem);
  }
}
