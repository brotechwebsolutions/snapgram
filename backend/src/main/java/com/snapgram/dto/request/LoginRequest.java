package com.snapgram.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class LoginRequest {
    @NotBlank private String email;
    @NotBlank private String password;
}
