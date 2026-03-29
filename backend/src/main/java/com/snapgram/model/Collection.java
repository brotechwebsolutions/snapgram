package com.snapgram.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.*;

@Data
@NoArgsConstructor
@Document(collection = "collections")
public class Collection {

    @Id
    private String id;

    private String userId;
    private String name;
    private List<String> postIds = new ArrayList<>();
    private String coverImage = "";
    private Instant createdAt = Instant.now();
}
