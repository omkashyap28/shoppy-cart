package com.omkashyap.com.backend.dto.requestDto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResetPasswordRequestDto {

  @NotBlank(message = "Password is required")
  @Size(min = 10, max = 50, message = "Password must be at least 10 characters")
  private String password;

  @NotBlank(message = "New password is required")
  @Size(min = 10, max = 50, message = "Password must be at least 10 characters")
  private String newPassword;

}
