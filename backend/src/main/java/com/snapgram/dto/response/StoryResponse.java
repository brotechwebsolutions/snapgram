package com.snapgram.dto.response;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;
@Data @Builder
public class StoryResponse {
    private String id;
    private UserResponse user;
    private String mediaUrl;
    private String mediaType;
    private String caption;
    private List<UserResponse> viewers;
    private int viewCount;
    private boolean isHighlight;
    private String highlightName;
    private boolean hasViewed;
    private Instant expiresAt;
    private Instant createdAt;
}
