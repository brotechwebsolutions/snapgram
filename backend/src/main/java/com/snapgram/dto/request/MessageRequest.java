package com.snapgram.dto.request;
import lombok.Data;
@Data
public class MessageRequest {
    private String text;
    private String sharedPostId;
}
