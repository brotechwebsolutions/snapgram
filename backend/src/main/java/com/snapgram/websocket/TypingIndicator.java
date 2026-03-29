package com.snapgram.websocket;
import lombok.Data;
@Data
public class TypingIndicator {
    private String conversationId;
    private String userId;
    private boolean isTyping;
}
