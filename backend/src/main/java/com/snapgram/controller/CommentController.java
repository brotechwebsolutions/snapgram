package com.snapgram.controller;
import com.snapgram.dto.request.CommentRequest;
import com.snapgram.dto.response.*;
import com.snapgram.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> add(@PathVariable String postId,
            @AuthenticationPrincipal UserDetails ud, @Valid @RequestBody CommentRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Comment added", commentService.addComment(postId, ud.getUsername(), req)));
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<ApiResponse<PageResponse<CommentResponse>>> get(@PathVariable String postId,
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        String cu = ud != null ? ud.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.ok("OK", commentService.getComments(postId, cu, page, size)));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        commentService.deleteComment(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Comment deleted"));
    }

    @PostMapping("/comments/{id}/like")
    public ResponseEntity<ApiResponse<Void>> like(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        commentService.likeComment(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Liked"));
    }

    @PostMapping("/comments/{id}/pin")
    public ResponseEntity<ApiResponse<Void>> pin(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        commentService.pinComment(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Pinned"));
    }
}
