package com.snapgram.controller;

import com.snapgram.dto.response.*;
import com.snapgram.service.PostService;
import com.snapgram.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final UserService userService;
    private final PostService postService;

    /**
     * Unified search endpoint.
     * type = "all" | "users" | "posts" | "hashtags"
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails ud) {

        String cu = ud != null ? ud.getUsername() : null;
        Map<String, Object> result = new HashMap<>();

        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok("OK", result));
        }

        String query = q.trim();

        if (type.equals("all") || type.equals("users")) {
            List<UserResponse> users = userService.searchUsers(query, cu);
            result.put("users", users);
        }

        if (type.equals("all") || type.equals("posts")) {
            PageResponse<PostResponse> posts = postService.getExploreFeed(cu, page, size);
            result.put("posts", posts.getContent());
        }

        if (type.equals("all") || type.equals("hashtags")) {
            // Return hashtag search results (posts containing the hashtag)
            String tag = query.startsWith("#") ? query.substring(1) : query;
            PageResponse<PostResponse> hashtagPosts = postService.searchByHashtag(tag, cu, page, size);
            result.put("hashtagPosts", hashtagPosts.getContent());
        }

        return ResponseEntity.ok(ApiResponse.ok("OK", result));
    }
}
