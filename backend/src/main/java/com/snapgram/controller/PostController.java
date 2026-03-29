package com.snapgram.controller;
import com.snapgram.dto.request.PostRequest;
import com.snapgram.dto.response.*;
import com.snapgram.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
@RestController @RequestMapping("/api/posts") @RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<PostResponse>> create(
            @AuthenticationPrincipal UserDetails ud,
            @RequestPart PostRequest post,
            @RequestPart(required=false) List<MultipartFile> images) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Post created", postService.createPost(ud.getUsername(), post, images)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        String cu = ud != null ? ud.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.ok("OK", postService.getPost(id, cu)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> update(@PathVariable String id,
            @AuthenticationPrincipal UserDetails ud, @RequestBody PostRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Post updated", postService.updatePost(id, ud.getUsername(), req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        postService.deletePost(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Post deleted"));
    }

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> feed(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="10") int size) {
        return ResponseEntity.ok(ApiResponse.ok("OK", postService.getFeed(ud.getUsername(), page, size)));
    }

    @GetMapping("/explore")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> explore(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="20") int size) {
        String cu = ud != null ? ud.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.ok("OK", postService.getExploreFeed(cu, page, size)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> userPosts(@PathVariable String userId,
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="12") int size) {
        String cu = ud != null ? ud.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.ok("OK", postService.getUserPosts(userId, cu, page, size)));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<Void>> like(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        postService.likePost(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Liked"));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<ApiResponse<Void>> unlike(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        postService.unlikePost(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Unliked"));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse<Void>> save(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        postService.savePost(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Saved"));
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<ApiResponse<Void>> unsave(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        postService.unsavePost(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Unsaved"));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> saved(@AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="12") int size) {
        return ResponseEntity.ok(ApiResponse.ok("OK", postService.getSavedPosts(ud.getUsername(), page, size)));
    }

    @PostMapping("/{id}/pin")
    public ResponseEntity<ApiResponse<Void>> pin(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        postService.pinPost(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Pinned"));
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<Void>> archive(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        postService.archivePost(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Archived"));
    }
}
