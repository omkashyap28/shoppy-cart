package com.omkashyap.com.backend.util;

import com.omkashyap.com.backend.dto.requestDto.EmailRequestDto;
import com.omkashyap.com.backend.service.EmailService;
import com.omkashyap.com.backend.type.EmailTypeEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmailUtil {

  private final EmailService emailService;

  public void sendPaymentSuccessEmail(
      String email,
      String orderId,
      String transactionId,
      String amount
  ) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("Transaction Completed")
            .emailType(EmailTypeEnum.PAYMENT_SUCCESS)
            .data(Map.of(
                "orderId", orderId,
                "amount", amount,
                "transactionId", transactionId
            ))
            .build()
    );
  }

  public void sendPaymentFailEmail(
      String email,
      String orderId,
      String transactionId,
      String amount
  ) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("Transaction Completed")
            .emailType(EmailTypeEnum.PAYMENT_SUCCESS)
            .data(Map.of(
                "orderId", orderId,
                "amount", amount,
                "transactionId", transactionId
            ))
            .build()
    );
  }

  public void sendUserWelcomeEmail(
      String email,
      String name,
      String userId
  ) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("Welcome to Shopyhub")
            .emailType(EmailTypeEnum.USER_WELCOME)
            .data(Map.of(
                "heading", "Welcome to Shopyhub",
                "name", name,
                "userId", userId
            ))
            .build()
    );
  }

  public void sendSellerWelcomeEmail(
      String email,
      String shopName,
      String sellerId
  ) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("Welcome to Shopyhub")
            .emailType(EmailTypeEnum.SELLER_WELCOME)
            .data(Map.of(
                "heading", "Welcome to Shopyhub",
                "shopName", shopName,
                "sellerId", sellerId
            ))
            .build()
    );
  }

  public void sendAffiliateWelcomeEmail(
      String email,
      String name,
      String affiliateCode
  ) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("Welcome to Shopyhub")
            .emailType(EmailTypeEnum.AFFILIATE_WELCOME)
            .data(Map.of(
                "heading", "Welcome to Shopyhub",
                "name", name,
                "affiliateCode", affiliateCode
            ))
            .build()
    );
  }

  public void sendWalletWelcomeEmail(String email, String firstName, String walletId) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("Welcome to Shopyhub")
            .emailType(EmailTypeEnum.WALLET_WELCOME)
            .data(Map.of(
                "name", firstName,
                "walletId", walletId
            ))
            .build()
    );
  }

  public void sendOrderConfirmationEmail(
      String email,
      String orderId,
      String orderTrackLink
  ) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("Welcome to Shopyhub")
            .emailType(EmailTypeEnum.ORDER_CONFIRMATION)
            .data(Map.of(
                "orderId", orderId,
                "orderTrackLink", orderTrackLink
            ))
            .build()
    );
  }

  public void sendOrderCancellationEmail(
      String email,
      String orderId
  ) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("Order Cancellation")
            .emailType(EmailTypeEnum.ORDER_CANCELLATION)
            .data(Map.of(
                "orderId", orderId
            ))
            .build()
    );
  }

  public void sendOrderReturnRequestEmail(
      String email,
      String orderId,
      String orderTrackLink
  ) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("Order Return Request")
            .emailType(EmailTypeEnum.ORDER_RETURN)
            .data(Map.of(
                "orderId", orderId,
                "orderTrackLink", orderTrackLink
            ))
            .build()
    );
  }

  public void sendOrderExchangeRequestEmail(
      String email,
      String orderId,
      String orderTrackLink
  ) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("Order Exchange Request")
            .emailType(EmailTypeEnum.ORDER_EXCHANGE)
            .data(Map.of(
                "orderId", orderId,
                "orderTrackLink", orderTrackLink
            ))
            .build()
    );
  }

  public void sendOtpEmail(String email, String otp) {
    emailService.sendEmail(
        EmailRequestDto.builder()
            .to(email)
            .subject("OTP Verification")
            .emailType(EmailTypeEnum.SELLER_OTP)
            .data(Map.of(
                "otpType", "Seller",
                "otp", otp
            ))
            .build()
    );
  }

}
