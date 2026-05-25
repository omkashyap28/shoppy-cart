package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.responseDto.InvoiceResponseDto;

public interface InvoiceService {

  InvoiceResponseDto getInvoice(String invoiceNo);

}
