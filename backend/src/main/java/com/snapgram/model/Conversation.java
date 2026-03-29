package com.snapgram.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.*;

@Data
@NoArgsConstructor
@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    private List<String> participants = new ArrayList<>();
    private String lastMessage = "";
    private String lastMessageSenderId;
    private Instant lastMessageAt = Instant.now();
    private Set<String> pinnedBy = new HashSet<>();
    private Map<String, Integer> unreadCount = new HashMap<>();
    private Instant createdAt = Instant.now();
}
