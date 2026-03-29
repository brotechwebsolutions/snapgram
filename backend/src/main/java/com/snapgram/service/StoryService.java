package com.snapgram.service;

import com.snapgram.dto.response.*;
import com.snapgram.exception.AppException;
import com.snapgram.model.Story;
import com.snapgram.model.User;
import com.snapgram.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final UserService userService;
    private final CloudinaryService cloudinaryService;

    public StoryResponse uploadStory(String userId, MultipartFile media, String caption) throws IOException {
        Map<String, String> result = cloudinaryService.uploadImage(media, "stories");
        Story story = new Story();
        story.setUserId(userId);
        story.setMediaUrl(result.get("url"));
        story.setPublicId(result.get("publicId"));
        story.setCaption(caption != null ? caption : "");
        story.setMediaType(
            media.getContentType() != null && media.getContentType().startsWith("video")
                ? "video" : "image"
        );
        return mapToResponse(storyRepository.save(story), userId);
    }

    public List<Map<String, Object>> getFeedStories(String userId) {
        User user = userService.findById(userId);
        List<String> feedUsers = new ArrayList<>(user.getFollowing());
        feedUsers.add(userId);

        List<Story> stories = storyRepository.findByUserIdInAndExpiresAtAfter(feedUsers, Instant.now());

        // Group stories by user, preserving order
        Map<String, List<Story>> grouped = new LinkedHashMap<>();
        stories.forEach(s -> grouped.computeIfAbsent(s.getUserId(), k -> new ArrayList<>()).add(s));

        return grouped.entrySet().stream().map(e -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("user", userService.getUserById(e.getKey(), userId));
            entry.put("stories", e.getValue().stream()
                .map(s -> mapToResponse(s, userId))
                .collect(Collectors.toList()));
            entry.put("hasUnviewed", e.getValue().stream().anyMatch(s ->
                s.getViewers().stream().noneMatch(v -> v.getUserId().equals(userId))
            ));
            return entry;
        }).collect(Collectors.toList());
    }

    public void viewStory(String storyId, String userId) {
        Story story = findById(storyId);
        boolean alreadyViewed = story.getViewers().stream()
            .anyMatch(v -> v.getUserId().equals(userId));
        if (!alreadyViewed) {
            Story.StoryViewer viewer = new Story.StoryViewer();
            viewer.setUserId(userId);
            story.getViewers().add(viewer);
            storyRepository.save(story);
        }
    }

    public void reactToStory(String storyId, String userId, String emoji) {
        Story story = findById(storyId);
        story.getReactions().removeIf(r -> r.getUserId().equals(userId));
        Story.StoryReaction reaction = new Story.StoryReaction();
        reaction.setUserId(userId);
        reaction.setEmoji(emoji);
        story.getReactions().add(reaction);
        storyRepository.save(story);
    }

    public void deleteStory(String storyId, String userId) {
        Story story = findById(storyId);
        if (!story.getUserId().equals(userId)) {
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        }
        if (story.getPublicId() != null && !story.getPublicId().isEmpty()) {
            try { cloudinaryService.deleteImage(story.getPublicId()); } catch (Exception ignored) {}
        }
        storyRepository.deleteById(storyId);
    }

    private Story findById(String id) {
        return storyRepository.findById(id)
            .orElseThrow(() -> new AppException("Story not found", HttpStatus.NOT_FOUND));
    }

    private StoryResponse mapToResponse(Story s, String currentUserId) {
        List<UserResponse> viewers = s.getViewers().stream()
            .map(v -> userService.getUserById(v.getUserId(), currentUserId))
            .collect(Collectors.toList());
        return StoryResponse.builder()
            .id(s.getId())
            .user(userService.getUserById(s.getUserId(), currentUserId))
            .mediaUrl(s.getMediaUrl())
            .mediaType(s.getMediaType())
            .caption(s.getCaption())
            .viewers(viewers)
            .viewCount(viewers.size())
            .isHighlight(s.isHighlight())
            .highlightName(s.getHighlightName())
            .hasViewed(s.getViewers().stream().anyMatch(v -> v.getUserId().equals(currentUserId)))
            .expiresAt(s.getExpiresAt())
            .createdAt(s.getCreatedAt())
            .build();
    }
}
