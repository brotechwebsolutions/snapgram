package com.snapgram.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.*;

@Data
@NoArgsConstructor
@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String userId;
    private List<PostImage> images = new ArrayList<>();
    private String caption = "";
    private List<String> hashtags = new ArrayList<>();
    private List<String> mentions = new ArrayList<>();
    private String location = "";

    // Plain names - no 'is' prefix to avoid Lombok serialization issues
    private boolean pinned = false;
    private boolean archived = false;
    private boolean draft = false;
    private boolean commentsDisabled = false;

    private Set<String> likes = new HashSet<>();
    private Set<String> saves = new HashSet<>();
    private long viewCount = 0;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
    private Instant deletedAt;

    @Data
    @NoArgsConstructor
    public static class PostImage {
        private String url;
        private String publicId;
    }
}
