package com.snapgram.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.*;

@Data
@NoArgsConstructor
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    private String conversationId;
    private String senderId;
    private String text;
    private String mediaUrl;
    private String sharedPostId;
    private MessageStatus status = MessageStatus.SENT;
    private Set<String> deletedFor = new HashSet<>();
    private Instant createdAt = Instant.now();

    public enum MessageStatus { SENT, DELIVERED, SEEN }
}
