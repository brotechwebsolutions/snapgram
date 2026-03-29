package com.snapgram.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.*;

@Data
@NoArgsConstructor
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String postId;
    private String userId;
    private String text;
    private String parentId;

    private Set<String> likes = new HashSet<>();
    private boolean pinned = false;

    private Instant createdAt = Instant.now();
    private Instant deletedAt;
}
