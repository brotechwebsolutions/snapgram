package com.snapgram.dto.response;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
@Data @Builder
public class UserResponse {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String profilePic;
    private String coverPhoto;
    private String website;
    private boolean isPrivate;
    private boolean emailVerified;
    private long followersCount;
    private long followingCount;
    private long postsCount;
    private boolean isFollowing;
    private boolean isBlocked;
    private Instant createdAt;
}
