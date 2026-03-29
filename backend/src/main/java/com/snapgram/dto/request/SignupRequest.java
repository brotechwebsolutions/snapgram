package com.snapgram.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class SignupRequest {
    @NotBlank @Size(min=3,max=30) private String username;
    @NotBlank @Email private String email;
    @NotBlank @Size(min=6,max=100) private String password;
    private String fullName;
}
