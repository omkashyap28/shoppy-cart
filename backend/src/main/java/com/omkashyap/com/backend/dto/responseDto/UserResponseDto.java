package com.omkashyap.com.backend.dto.responseDto;

import com.omkashyap.com.backend.type.GenderEnum;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class UserResponseDto {

  private String userId;
  private String firstName;
  private String lastName;
  private LocalDate dateOfBirth;
  private GenderEnum gender;
  private String email;
  private String contact;
  private String avatarUrl;
  private String fileId;
  private List<UserAddressResponseDto> addresses;
  private LocalDateTime createdAt;

}
