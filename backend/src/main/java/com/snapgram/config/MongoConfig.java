package com.snapgram.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.TextIndexDefinition;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class MongoConfig {

    private final MongoTemplate mongoTemplate;

    @PostConstruct
    public void createIndexes() {
        try {
            // Users — unique indexes (also declared via @Indexed on model, but explicit here for safety)
            mongoTemplate.indexOps("users")
                .ensureIndex(new Index().on("username", Sort.Direction.ASC).unique());
            mongoTemplate.indexOps("users")
                .ensureIndex(new Index().on("email", Sort.Direction.ASC).unique());
            mongoTemplate.indexOps("users")
                .ensureIndex(new Index().on("verifyToken", Sort.Direction.ASC).sparse());
            mongoTemplate.indexOps("users")
                .ensureIndex(new Index().on("resetToken", Sort.Direction.ASC).sparse());

            // Posts — feed and explore queries
            mongoTemplate.indexOps("posts")
                .ensureIndex(new Index().on("userId", Sort.Direction.ASC).on("createdAt", Sort.Direction.DESC));
            mongoTemplate.indexOps("posts")
                .ensureIndex(new Index().on("createdAt", Sort.Direction.DESC));
            mongoTemplate.indexOps("posts")
                .ensureIndex(new Index().on("hashtags", Sort.Direction.ASC));
            mongoTemplate.indexOps("posts")
                .ensureIndex(new Index().on("deletedAt", Sort.Direction.ASC).sparse());

            // Comments — by post and parent
            mongoTemplate.indexOps("comments")
                .ensureIndex(new Index().on("postId", Sort.Direction.ASC).on("createdAt", Sort.Direction.ASC));
            mongoTemplate.indexOps("comments")
                .ensureIndex(new Index().on("parentId", Sort.Direction.ASC).sparse());

            // Stories — expiry
            mongoTemplate.indexOps("stories")
                .ensureIndex(new Index().on("userId", Sort.Direction.ASC));
            mongoTemplate.indexOps("stories")
                .ensureIndex(new Index().on("expiresAt", Sort.Direction.ASC));

            // Messages — by conversation
            mongoTemplate.indexOps("messages")
                .ensureIndex(new Index().on("conversationId", Sort.Direction.ASC).on("createdAt", Sort.Direction.DESC));

            // Conversations — by participant
            mongoTemplate.indexOps("conversations")
                .ensureIndex(new Index().on("participants", Sort.Direction.ASC));
            mongoTemplate.indexOps("conversations")
                .ensureIndex(new Index().on("lastMessageAt", Sort.Direction.DESC));

            // Notifications — by recipient
            mongoTemplate.indexOps("notifications")
                .ensureIndex(new Index().on("recipientId", Sort.Direction.ASC).on("createdAt", Sort.Direction.DESC));

            // Notes — expiry
            mongoTemplate.indexOps("notes")
                .ensureIndex(new Index().on("userId", Sort.Direction.ASC));
            mongoTemplate.indexOps("notes")
                .ensureIndex(new Index().on("expiresAt", Sort.Direction.ASC));

            log.info("MongoDB indexes created/verified successfully");
        } catch (Exception e) {
            log.warn("Failed to create some indexes (may already exist): {}", e.getMessage());
        }
    }
}
