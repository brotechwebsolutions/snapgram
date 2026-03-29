package com.snapgram.dto.response;
import com.snapgram.model.Message;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
@Data @Builder
public class MessageResponse {
    private String id;
    private String conversationId;
    private UserResponse sender;
    private String text;
    private String mediaUrl;
    private String sharedPostId;
    private Message.MessageStatus status;
    private Instant createdAt;
}
