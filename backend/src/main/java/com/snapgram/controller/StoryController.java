package com.snapgram.controller;
import com.snapgram.dto.response.*;
import com.snapgram.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api/stories") @RequiredArgsConstructor
public class StoryController {
    private final StoryService storyService;

    @PostMapping(consumes="multipart/form-data")
    public ResponseEntity<ApiResponse<StoryResponse>> upload(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam MultipartFile media,
            @RequestParam(required=false, defaultValue="") String caption) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Story uploaded", storyService.uploadStory(ud.getUsername(), media, caption)));
    }

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> feed(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok("OK", storyService.getFeedStories(ud.getUsername())));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<ApiResponse<Void>> view(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        storyService.viewStory(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Viewed"));
    }

    @PostMapping("/{id}/react")
    public ResponseEntity<ApiResponse<Void>> react(@PathVariable String id, @AuthenticationPrincipal UserDetails ud,
            @RequestBody Map<String, String> body) {
        storyService.reactToStory(id, ud.getUsername(), body.get("emoji"));
        return ResponseEntity.ok(ApiResponse.ok("Reacted"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        storyService.deleteStory(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Story deleted"));
    }
}
