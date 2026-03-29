package com.snapgram.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@Document(collection = "notes")
public class Note {

    @Id
    private String id;

    private String userId;
    private String text;
    private String privacy = "followers";
    private Instant expiresAt = Instant.now().plusSeconds(86400);
    private Instant createdAt = Instant.now();
}
