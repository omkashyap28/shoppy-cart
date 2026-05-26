package com.omkashyap.com.backend.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
@RequiredArgsConstructor
public class AffiliateUtil {

  public String generateAffiliateLink(String productUrl, String affiliateCode) {
    return productUrl + "?refId=" + affiliateCode;
  }

  public BigDecimal getTotalEarning(
      Double price,
      BigDecimal commissionPercentage
  ) {

    BigDecimal amount;
    if (price != null) {
      amount = BigDecimal.valueOf(price);
    } else {
      throw new IllegalArgumentException(
          "Price must be provided"
      );
    }

    // commission calculation
    return amount.multiply(
            commissionPercentage.divide(BigDecimal.valueOf(100))
        )
        .setScale(2, RoundingMode.HALF_UP);
  }

}
