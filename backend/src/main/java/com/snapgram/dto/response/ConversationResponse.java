package com.snapgram.dto.response;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;
@Data @Builder
public class ConversationResponse {
    private String id;
    private List<UserResponse> participants;
    private String lastMessage;
    private Instant lastMessageAt;
    private int unreadCount;
    private boolean isPinned;
    private boolean isOnline;
}
