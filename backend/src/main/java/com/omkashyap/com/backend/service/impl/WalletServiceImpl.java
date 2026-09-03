package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.WalletPaymentRequestDto;
import com.omkashyap.com.backend.dto.requestDto.WalletRequestDto;
import com.omkashyap.com.backend.dto.responseDto.WalletPaymentResponseDto;
import com.omkashyap.com.backend.dto.responseDto.WalletResponseDto;
import com.omkashyap.com.backend.dtoMapper.UserWalletDtoMapper;
import com.omkashyap.com.backend.entity.Payment;
import com.omkashyap.com.backend.entity.Product;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.entity.UserWallet;
import com.omkashyap.com.backend.error.InvalidArgumentException;
import com.omkashyap.com.backend.error.NotFoundException;
import com.omkashyap.com.backend.error.TemporaryLockException;
import com.omkashyap.com.backend.repository.PaymentRepository;
import com.omkashyap.com.backend.repository.ProductRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.repository.UserWalletRepository;
import com.omkashyap.com.backend.service.WalletService;
import com.omkashyap.com.backend.type.PaymentStatusEnum;
import com.omkashyap.com.backend.util.AuthHeaderUtil;
import com.omkashyap.com.backend.util.EmailUtil;
import com.omkashyap.com.backend.util.WalletUtil;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

  private final UserWalletRepository userWalletRepository;
  private final UserRepository userRepository;
  private final AuthHeaderUtil authHeaderUtil;
  private final UserWalletDtoMapper userWalletDtoMapper;
  private final WalletUtil walletUtil;
  private final PaymentRepository paymentRepository;
  private final ProductRepository productRepository;
  private final EmailUtil emailUtil;

  @Override
  public WalletResponseDto createUserWallet(
      String authHeader,
      @Valid WalletRequestDto requestDto) {
    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);
    User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not exists"));

    UserWallet userWallet = UserWallet.builder()
        .user(user)
        .mPin(walletUtil.encodeMPin(requestDto.getMPin()))
        .build();

    userWalletRepository.save(userWallet);

    emailUtil.sendWalletWelcomeEmail(
        userWallet.getUser().getEmail(),
        userWallet.getUser().getFirstName(),
        userWallet.getWalletId());

    return userWalletDtoMapper.mapToWalletResponseDto(userWallet);
  }

  @Override
  public WalletResponseDto getUserWallet(
      String authHeader,
      @Valid WalletRequestDto requestDto) {
    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);

    UserWallet userWallet = userWalletRepository.findByUser_Email(email)
        .orElseThrow(() -> new NotFoundException("Wallet not exists for this user"));

    if (userWallet.getInvalidAttempts() >= 5) {
      walletUtil.lockAccount(userWallet);
    }

    if (userWallet.getIsLocked() &&
        userWallet.getLockedUntil() != null &&
        userWallet.getLockedUntil().isAfter(LocalDateTime.now())) {
      LocalDateTime lockedUntil = userWallet.getLockedUntil();
      throw new TemporaryLockException("Account is temporary locked due to too many invalid attempts. Please try after "
          + lockedUntil.getMinute() + "minutes");
    }

    walletUtil.unlockAccount(userWallet);

    boolean isValid = walletUtil.compareMPin(requestDto.getMPin(), userWallet.getMPin());
    if (!isValid) {
      userWallet.setInvalidAttempts(userWallet.getInvalidAttempts() + 1);
      throw new InvalidArgumentException("Invalid MPIN");
    }

    return userWalletDtoMapper.mapToWalletResponseDto(userWallet);
  }

  @Override
  @Transactional
  public WalletPaymentResponseDto makePayment(String authHeader, WalletPaymentRequestDto requestDto) {

    Payment payment = paymentRepository.findByPaymentId(requestDto.getPaymentId())
        .orElseThrow(() -> new IllegalArgumentException("Invalid payment id"));

    if (payment.getPaymentStatus() != PaymentStatusEnum.PENDING) {
      throw new RuntimeException("Payment already completed");
    }

    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);
    UserWallet userWallet = userWalletRepository.findByUser_Email(email)
        .orElseThrow(() -> new IllegalArgumentException("Wallet not exists for this user"));

    if (!payment.getOrderItem().getOrder().getUser().getEmail().equals(userWallet.getUser().getEmail())) {
      throw new NotFoundException("Unauthorized payment");
    }

    if (userWallet.getCoins() < payment.getCoins()) {
      payment.setPaymentStatus(PaymentStatusEnum.FAILED);
      emailUtil.sendPaymentFailEmail(
          payment.getOrderItem().getOrder().getUser().getEmail(),
          payment.getOrderItem().getOrderItemId(),
          String.valueOf(payment.getAmount()),
          payment.getTransactionId());
      throw new InvalidArgumentException("User not have sufficient coins to pay");
    }

    if (userWallet.getInvalidAttempts() >= 5) {
      walletUtil.lockAccount(userWallet);
    }

    if (userWallet.getIsLocked() &&
        userWallet.getLockedUntil() != null &&
        userWallet.getLockedUntil().isAfter(LocalDateTime.now())) {
      LocalDateTime lockedUntil = userWallet.getLockedUntil();
      throw new RuntimeException("Account is temporarily locked. Please try after " + lockedUntil);
    }

    walletUtil.unlockAccount(userWallet);

    boolean isValid = walletUtil.compareMPin(requestDto.getMPin(), userWallet.getMPin());

    if (isValid) {
      userWallet.setCoins(userWallet.getCoins() - payment.getCoins());
      userWallet.setTotalDebits(userWallet.getTotalDebits() + payment.getCoins());
      userWallet.setInvalidAttempts(0);

      payment.setPaymentStatus(PaymentStatusEnum.SUCCESS);
      payment.setPaidAt(LocalDateTime.now());
      userWalletRepository.save(userWallet);
      paymentRepository.save(payment);

    } else {
      payment.setPaymentStatus(PaymentStatusEnum.PENDING);
      userWallet.setInvalidAttempts(userWallet.getInvalidAttempts() + 1);
      userWalletRepository.save(userWallet);
      paymentRepository.save(payment);

      throw new IllegalArgumentException("Invalid MPin");
    }

    if (payment.getPaymentStatus().equals(PaymentStatusEnum.SUCCESS)) {
      Product product = productRepository.findByProductId(
          payment.getOrderItem().getProduct().getProductId()).orElse(null);
      if (product != null) {
        product.setTotalEarning(product.getTotalEarning()
            .add(BigDecimal.valueOf(product.getPrice() * payment.getOrderItem().getQuantity())));
        productRepository.save(product);
      }
    }

    if (payment.getPaymentStatus().equals(PaymentStatusEnum.FAILED)) {
      emailUtil.sendPaymentFailEmail(
          payment.getOrderItem().getOrder().getUser().getEmail(),
          payment.getOrderItem().getOrderItemId(),
          String.valueOf(payment.getAmount()),
          payment.getTransactionId());
    } else {
      emailUtil.sendPaymentSuccessEmail(
          payment.getOrderItem().getOrder().getUser().getEmail(),
          payment.getOrderItem().getOrderItemId(),
          String.valueOf(payment.getAmount()),
          payment.getTransactionId());
    }

    return userWalletDtoMapper.mapToWalletPaymentResponseDto(payment);
  }
}
