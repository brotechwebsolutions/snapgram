package com.snapgram.dto.response;
import com.snapgram.model.Notification;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
@Data @Builder
public class NotificationResponse {
    private String id;
    private UserResponse sender;
    private Notification.NotificationType type;
    private String postId;
    private String message;
    private boolean isRead;
    private Instant createdAt;
}
