package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.responseDto.InvoiceResponseDto;
import com.omkashyap.com.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/invoice")
public class InvoiceController {

  private final InvoiceService invoiceService;

  @GetMapping("/{invoiceNo}")
  ResponseEntity<InvoiceResponseDto> getInvoice(@PathVariable String invoiceNo) {
    return ResponseEntity.status(HttpStatus.OK).body(
        invoiceService.getInvoice(invoiceNo)
    );
  }

}
