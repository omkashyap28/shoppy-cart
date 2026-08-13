package com.omkashyap.com.backend.dto.requestDto;

import com.omkashyap.com.backend.type.GenderEnum;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SignUpRequestDto {

  @NotBlank(message = "First name is required")
  @Size(min = 3, max = 50, message = "First name should be less than 50 character")
  private String firstName;

  @Size(min = 3, max = 50, message = "Last name should be less than 50 character")
  private String lastName;

  @NotBlank(message = "Email is required")
  @Email(message = "Invalid email format")
  @Size(min = 5, max = 100, message = "Email should be less than 100 character")
  private String email;

  @Size(min = 10, max = 50, message = "Password must be at least 6 characters")
  private String password;

  @Size(min = 10, max = 10)
  @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
  private String contact;

  private GenderEnum gender;
  private LocalDate dateOfBirth;

  private String avatarUrl;
}