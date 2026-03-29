package com.snapgram.controller;
import com.snapgram.dto.request.MessageRequest;
import com.snapgram.dto.response.*;
import com.snapgram.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getConversations(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok("OK", messageService.getConversations(ud.getUsername())));
    }

    @PostMapping("/conversations")
    public ResponseEntity<ApiResponse<ConversationResponse>> createOrGet(
            @AuthenticationPrincipal UserDetails ud, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok("OK", messageService.getOrCreateConversation(ud.getUsername(), body.get("userId"))));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResponse<PageResponse<MessageResponse>>> getMessages(
            @PathVariable String id, @AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="30") int size) {
        return ResponseEntity.ok(ApiResponse.ok("OK", messageService.getMessages(id, ud.getUsername(), page, size)));
    }

    @PostMapping(value="/conversations/{id}/messages", consumes="multipart/form-data")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @PathVariable String id, @AuthenticationPrincipal UserDetails ud,
            @RequestPart MessageRequest message,
            @RequestPart(required=false) MultipartFile media) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok("Message sent", messageService.sendMessage(id, ud.getUsername(), message, media)));
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id, @AuthenticationPrincipal UserDetails ud) {
        messageService.deleteMessage(id, ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Message deleted"));
    }
}
