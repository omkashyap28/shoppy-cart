package com.omkashyap.com.backend.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AffiliateUtil {

  public String generateAffiliateLink(String productUrl, String affiliateCode) {
    return productUrl + "?refId=" + affiliateCode;
  }

}
