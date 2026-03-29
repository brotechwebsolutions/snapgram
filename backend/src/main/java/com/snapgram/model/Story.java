package com.snapgram.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.*;

@Data
@NoArgsConstructor
@Document(collection = "stories")
public class Story {

    @Id
    private String id;

    private String userId;
    private String mediaUrl;
    private String mediaType = "image";
    private String publicId;
    private String caption = "";

    private List<StoryViewer> viewers = new ArrayList<>();
    private List<StoryReaction> reactions = new ArrayList<>();

    private boolean highlight = false;
    private String highlightName = "";

    private Instant expiresAt = Instant.now().plusSeconds(86400);
    private Instant createdAt = Instant.now();

    @Data
    @NoArgsConstructor
    public static class StoryViewer {
        private String userId;
        private Instant viewedAt = Instant.now();
    }

    @Data
    @NoArgsConstructor
    public static class StoryReaction {
        private String userId;
        private String emoji;
    }
}
