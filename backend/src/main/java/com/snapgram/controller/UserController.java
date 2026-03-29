package com.snapgram.controller;

import com.snapgram.dto.request.UpdateProfileRequest;
import com.snapgram.dto.response.*;
import com.snapgram.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** Search users by query string */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> search(
            @RequestParam String q,
            @AuthenticationPrincipal UserDetails ud) {
        String currentUserId = ud != null ? ud.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.ok("OK", userService.searchUsers(q, currentUserId)));
    }

    /** Get suggested users to follow */
    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<UserResponse>>> suggestions(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok("OK", userService.getSuggestedUsers(ud.getUsername())));
    }

    /** Get user by ID */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        String currentUserId = ud != null ? ud.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.ok("OK", userService.getUserById(id, currentUserId)));
    }

    /**
     * Get user by USERNAME — used by Profile page.
     * Frontend sends username in URL; this resolves to the full user object.
     */
    @GetMapping("/by-username/{username}")
    public ResponseEntity<ApiResponse<UserResponse>> getByUsername(
            @PathVariable String username,
            @AuthenticationPrincipal UserDetails ud) {
        String currentUserId = ud != null ? ud.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.ok("OK", userService.getUserByUsername(username, currentUserId)));
    }

    /** Update own profile text fields */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody UpdateProfileRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", userService.updateProfile(ud.getUsername(), req)));
    }

    /** Upload profile picture */
    @PostMapping("/me/avatar")
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Profile picture updated",
                userService.uploadProfilePic(ud.getUsername(), file)));
    }

    /** Upload cover photo */
    @PostMapping("/me/cover")
    public ResponseEntity<ApiResponse<UserResponse>> uploadCover(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Cover photo updated",
                userService.uploadCoverPhoto(ud.getUsername(), file)));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<ApiResponse<Void>> follow(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        userService.followUser(ud.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Following"));
    }

    @DeleteMapping("/{id}/follow")
    public ResponseEntity<ApiResponse<Void>> unfollow(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        userService.unfollowUser(ud.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Unfollowed"));
    }

    @PostMapping("/{id}/block")
    public ResponseEntity<ApiResponse<Void>> block(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        userService.blockUser(ud.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("User blocked"));
    }

    @DeleteMapping("/{id}/block")
    public ResponseEntity<ApiResponse<Void>> unblock(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        userService.unblockUser(ud.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("User unblocked"));
    }

    @PostMapping("/{id}/mute")
    public ResponseEntity<ApiResponse<Void>> mute(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        userService.muteUser(ud.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("User muted"));
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<ApiResponse<List<UserResponse>>> followers(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        String cu = ud != null ? ud.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.ok("OK", userService.getFollowers(id, cu)));
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<ApiResponse<List<UserResponse>>> following(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        String cu = ud != null ? ud.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.ok("OK", userService.getFollowing(id, cu)));
    }
}
