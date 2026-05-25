package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.responseDto.AllAddressResponseDto;
import com.omkashyap.com.backend.dto.responseDto.InvoiceResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ShopAddressResponseDto;
import com.omkashyap.com.backend.entity.Invoice;
import com.omkashyap.com.backend.repository.InvoiceRepository;
import com.omkashyap.com.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

  private final InvoiceRepository invoiceRepository;
  private final ModelMapper modelMapper;

  @Override
  public InvoiceResponseDto getInvoice(String invoiceNo) {
    Invoice invoice = invoiceRepository.findByInvoiceNo(invoiceNo).orElseThrow(() ->
        new IllegalArgumentException("Invoice not exists"));

    InvoiceResponseDto responseDto = InvoiceResponseDto.builder()
        .invoiceNo(invoice.getInvoiceNo())
        .transactionId(invoice.getPayment().getTransactionId())
        .paymentId(invoice.getPayment().getPaymentId())
        .address(modelMapper.map(invoice.getOrderItem().getAddress(), AllAddressResponseDto.class))
        .buyerName(invoice.getUser().getFirstName() + invoice.getUser().getLastName())
        .buyerEmail(invoice.getUser().getEmail())
        .seller(invoice.getOrderItem().getProduct().getSeller().getShopName())
        .shopAddress(modelMapper.map(invoice.getOrderItem().getProduct().getSeller().getShopAddress(), ShopAddressResponseDto.class))
        .amount(null)
        .paymentMethod(invoice.getPayment().getPaymentMethod())
        .orderId(invoice.getOrderItem().getOrderItemId())
        .quantity(invoice.getOrderItem().getQuantity())
        .productDescription(invoice.getOrderItem().getProduct().getDescription())
        .build();

    String amount = switch (invoice.getPayment().getPaymentMethod()) {
      case UPI, PAY_ON_DELIVERY, CASH -> String.valueOf(invoice.getPayment().getAmount());
      case WALLET -> String.valueOf(invoice.getPayment().getCoins());
    };
    responseDto.setAmount(amount);

    return responseDto;
  }
}
