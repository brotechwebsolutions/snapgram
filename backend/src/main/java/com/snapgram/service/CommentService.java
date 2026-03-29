package com.snapgram.service;

import com.snapgram.dto.request.CommentRequest;
import com.snapgram.dto.response.CommentResponse;
import com.snapgram.dto.response.PageResponse;
import com.snapgram.exception.AppException;
import com.snapgram.model.Comment;
import com.snapgram.model.Notification;
import com.snapgram.repository.CommentRepository;
import com.snapgram.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public CommentResponse addComment(String postId, String userId, CommentRequest req) {
        var post = postRepository.findById(postId)
            .orElseThrow(() -> new AppException("Post not found", HttpStatus.NOT_FOUND));
        if (post.isCommentsDisabled()) {
            throw new AppException("Comments are disabled on this post", HttpStatus.FORBIDDEN);
        }
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setText(req.getText());
        comment.setParentId(req.getParentId());
        Comment saved = commentRepository.save(comment);

        Notification.NotificationType type = req.getParentId() != null
            ? Notification.NotificationType.REPLY
            : Notification.NotificationType.COMMENT;
        notificationService.createNotification(
            post.getUserId(), userId, type, postId, saved.getId(), "commented on your post"
        );
        return mapToResponse(saved, userId);
    }

    public PageResponse<CommentResponse> getComments(String postId, String currentUserId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        var pageResult = commentRepository.findTopLevelByPostId(postId, pageable);
        List<CommentResponse> content = pageResult.getContent().stream()
            .map(c -> {
                CommentResponse resp = mapToResponse(c, currentUserId);
                List<CommentResponse> replies = commentRepository.findRepliesByParentId(c.getId())
                    .stream()
                    .map(r -> mapToResponse(r, currentUserId))
                    .collect(Collectors.toList());
                resp.setReplies(replies);
                return resp;
            })
            .collect(Collectors.toList());

        return PageResponse.<CommentResponse>builder()
            .content(content).page(page).size(size)
            .totalElements(pageResult.getTotalElements())
            .totalPages(pageResult.getTotalPages())
            .hasNext(pageResult.hasNext()).hasPrev(page > 0)
            .build();
    }

    public void deleteComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new AppException("Comment not found", HttpStatus.NOT_FOUND));
        if (!comment.getUserId().equals(userId)) {
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        }
        comment.setDeletedAt(Instant.now());
        commentRepository.save(comment);
    }

    public void likeComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new AppException("Comment not found", HttpStatus.NOT_FOUND));
        if (comment.getLikes().contains(userId)) {
            comment.getLikes().remove(userId);
        } else {
            comment.getLikes().add(userId);
        }
        commentRepository.save(comment);
    }

    public void pinComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new AppException("Comment not found", HttpStatus.NOT_FOUND));
        comment.setPinned(!comment.isPinned());
        commentRepository.save(comment);
    }

    private CommentResponse mapToResponse(Comment c, String currentUserId) {
        return CommentResponse.builder()
            .id(c.getId())
            .postId(c.getPostId())
            .user(userService.getUserById(c.getUserId(), currentUserId))
            .text(c.getText())
            .parentId(c.getParentId())
            .likesCount(c.getLikes().size())
            .isLiked(currentUserId != null && c.getLikes().contains(currentUserId))
            .isPinned(c.isPinned())
            .replies(Collections.emptyList())
            .createdAt(c.getCreatedAt())
            .build();
    }
}
