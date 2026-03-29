package com.snapgram.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;
import java.util.*;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String fullName = "";
    private String bio = "";
    private String profilePic = "";
    private String coverPhoto = "";
    private String website = "";

    // Use plain names (not 'is' prefix) to avoid Lombok/Jackson conflicts
    private boolean privateAccount = false;
    private boolean emailVerified = false;
    private boolean active = true;

    private String verifyToken;
    private Instant verifyTokenExpiry;
    private String resetToken;
    private Instant resetTokenExpiry;

    private int failedLoginAttempts = 0;
    private Instant lockedUntil;

    private Set<String> followers = new HashSet<>();
    private Set<String> following = new HashSet<>();
    private Set<String> blockedUsers = new HashSet<>();
    private Set<String> mutedUsers = new HashSet<>();

    private List<LoginHistory> loginHistory = new ArrayList<>();

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @Data
    @NoArgsConstructor
    public static class LoginHistory {
        private String ip;
        private String device;
        private Instant timestamp = Instant.now();
    }
}
