package com.omkashyap.com.backend.dto.requestDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class LoginRequestDto {

  @NotBlank(message = "Email is required")
  @Email(message = "Invalid email format")
  @Size(max = 100, message = "Email should be less than 100 character")
  private String email;

  @NotBlank(message = "Password is required")
  @Size(min = 10, max = 50, message = "Password must be at least 10 characters")
  private String password;
}
