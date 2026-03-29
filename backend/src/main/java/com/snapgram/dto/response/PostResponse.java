package com.snapgram.dto.response;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;
@Data @Builder
public class PostResponse {
    private String id;
    private UserResponse user;
    private List<String> imageUrls;
    private String caption;
    private List<String> hashtags;
    private List<String> mentions;
    private String location;
    private boolean isPinned;
    private boolean isArchived;
    private boolean commentsDisabled;
    private long likesCount;
    private long commentsCount;
    private long viewCount;
    private boolean isLiked;
    private boolean isSaved;
    private Instant createdAt;
}
