package com.snapgram.controller;
import com.snapgram.dto.response.*;
import com.snapgram.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/notifications") @RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<NotificationResponse>>> get(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(ApiResponse.ok("OK", notificationService.getNotifications(ud.getUsername(), page, size)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> unreadCount(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok("OK", notificationService.getUnreadCount(ud.getUsername())));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllRead(@AuthenticationPrincipal UserDetails ud) {
        notificationService.markAllRead(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAll(@AuthenticationPrincipal UserDetails ud) {
        notificationService.deleteAll(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Notifications cleared"));
    }
}
