package com.snapgram.dto.response;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;
@Data @Builder
public class CommentResponse {
    private String id;
    private String postId;
    private UserResponse user;
    private String text;
    private String parentId;
    private long likesCount;
    private boolean isLiked;
    private boolean isPinned;
    private List<CommentResponse> replies;
    private Instant createdAt;
}
