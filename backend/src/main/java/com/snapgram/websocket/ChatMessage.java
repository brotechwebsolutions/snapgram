package com.snapgram.websocket;
import lombok.Data;
@Data
public class ChatMessage {
    private String conversationId;
    private String text;
    private String sharedPostId;
    private MessageType type;
    public enum MessageType { CHAT, TYPING, SEEN }
}
