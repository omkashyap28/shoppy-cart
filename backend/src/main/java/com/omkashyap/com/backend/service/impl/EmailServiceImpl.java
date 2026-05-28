package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.EmailRequestDto;
import com.omkashyap.com.backend.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

  private final JavaMailSender javaMailSender;
  private final SpringTemplateEngine springTemplateEngine;

  @Async
  public void sendEmail(EmailRequestDto requestDto) {

    try {
      String templateName = switch (requestDto.getEmailType()) {
        case SELLER_OTP, WALLET_OTP -> "otp";
        case ORDER_CONFIRMATION -> "order-confirmation";
        case ORDER_CANCELLATION -> "order-cancellation";
        case ORDER_EXCHANGE -> "order-exchange";
        case ORDER_RETURN -> "order-return";
        case PAYMENT_SUCCESS -> "payment-success";
        case PAYMENT_FAILED -> "payment-failed";
        case USER_WELCOME -> "user-welcome";
        case SELLER_WELCOME -> "seller-welcome";
        case AFFILIATE_WELCOME -> " affiliate-welcome";
        case WALLET_WELCOME -> "wallet-welcome";
      };

      Context context = new Context();
      context.setVariables(requestDto.getData());

      String htmlContent = springTemplateEngine.process(
          "emails/" + templateName,
          context
      );

      MimeMessage message = javaMailSender.createMimeMessage();

      MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);

      messageHelper.setTo(requestDto.getTo());
      messageHelper.setSubject(requestDto.getSubject());
      messageHelper.setText(htmlContent, true);

      javaMailSender.send(message);

    } catch (MessagingException e) {
      throw new RuntimeException(e);
    }

  }

}
