package com.omkashyap.com.backend.dto.requestDto;

import com.omkashyap.com.backend.type.EmailTypeEnum;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class EmailRequestDto {

  private String to;
  private String subject;
  private EmailTypeEnum emailType;
  private Map<String, Object> data;
}
