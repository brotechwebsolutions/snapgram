package com.snapgram.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String recipientId;
    private String senderId;
    private NotificationType type;
    private String postId;
    private String commentId;
    private String message = "";
    private boolean read = false;

    private Instant createdAt = Instant.now();

    public enum NotificationType {
        LIKE, COMMENT, FOLLOW, MENTION, REPLY, STORY_REACT
    }
}
