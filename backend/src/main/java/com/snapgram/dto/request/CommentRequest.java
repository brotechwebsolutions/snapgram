package com.snapgram.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class CommentRequest {
    @NotBlank @Size(max=1000) private String text;
    private String parentId;
}
