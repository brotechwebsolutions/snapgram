package com.snapgram.service;

import com.snapgram.dto.response.NotificationResponse;
import com.snapgram.dto.response.PageResponse;
import com.snapgram.model.Notification;
import com.snapgram.model.Notification.NotificationType;
import com.snapgram.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    public void createNotification(
            String recipientId, String senderId,
            NotificationType type, String postId,
            String commentId, String message) {
        if (recipientId == null || recipientId.equals(senderId)) return;
        Notification n = new Notification();
        n.setRecipientId(recipientId);
        n.setSenderId(senderId);
        n.setType(type);
        n.setPostId(postId);
        n.setCommentId(commentId);
        n.setMessage(message);
        notificationRepository.save(n);
        try {
            NotificationResponse response = mapToResponse(n);
            messagingTemplate.convertAndSendToUser(recipientId, "/queue/notifs", response);
        } catch (Exception ignored) {
            // WebSocket delivery failure should not break the operation
        }
    }

    public PageResponse<NotificationResponse> getNotifications(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> pageResult = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId, pageable);
        return PageResponse.<NotificationResponse>builder()
            .content(pageResult.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
            .page(page).size(size)
            .totalElements(pageResult.getTotalElements())
            .totalPages(pageResult.getTotalPages())
            .hasNext(pageResult.hasNext()).hasPrev(page > 0)
            .build();
    }

    public void markAllRead(String userId) {
        List<Notification> notifs = notificationRepository.findByRecipientId(userId);
        notifs.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifs);
    }

    public void deleteAll(String userId) {
        notificationRepository.deleteAll(notificationRepository.findByRecipientId(userId));
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
            .id(n.getId())
            .sender(userService.getUserById(n.getSenderId(), null))
            .type(n.getType())
            .postId(n.getPostId())
            .message(n.getMessage())
            .isRead(n.isRead())
            .createdAt(n.getCreatedAt())
            .build();
    }
}
