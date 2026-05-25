package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
  Optional<Invoice> findByInvoiceNo(String invoiceId);
}