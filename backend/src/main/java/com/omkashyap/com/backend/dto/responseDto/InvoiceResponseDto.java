package com.omkashyap.com.backend.dto.responseDto;

import com.omkashyap.com.backend.type.PaymentMethodEnum;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InvoiceResponseDto {

  private String invoiceNo;
  private String transactionId;
  private String paymentId;
  private AllAddressResponseDto address;
  private String buyerName;
  private String buyerEmail;
  private String seller;
  private ShopAddressResponseDto shopAddress;
  private String amount;
  private PaymentMethodEnum paymentMethod;
  private String orderId;
  private Integer quantity;
  private String productDescription;

}
