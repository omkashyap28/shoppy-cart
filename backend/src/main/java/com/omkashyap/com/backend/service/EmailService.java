package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.EmailRequestDto;

public interface EmailService {
  void sendEmail(EmailRequestDto requestDto);
}
