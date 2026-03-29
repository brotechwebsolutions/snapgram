package com.snapgram.service;

import com.snapgram.dto.request.PostRequest;
import com.snapgram.dto.response.*;
import com.snapgram.exception.AppException;
import com.snapgram.model.Notification;
import com.snapgram.model.Post;
import com.snapgram.model.User;
import com.snapgram.repository.CommentRepository;
import com.snapgram.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserService userService;
    private final CloudinaryService cloudinaryService;
    private final NotificationService notificationService;

    public PostResponse createPost(String userId, PostRequest req, List<MultipartFile> images) throws IOException {
        Post post = new Post();
        post.setUserId(userId);
        post.setCaption(req.getCaption() != null ? req.getCaption() : "");
        post.setHashtags(req.getHashtags() != null ? req.getHashtags() : new ArrayList<>());
        post.setMentions(req.getMentions() != null ? req.getMentions() : new ArrayList<>());
        post.setLocation(req.getLocation() != null ? req.getLocation() : "");
        post.setDraft(req.isDraft());
        post.setCommentsDisabled(req.isCommentsDisabled());

        if (images != null && !images.isEmpty()) {
            for (MultipartFile img : images) {
                if (!img.isEmpty()) {
                    Map<String, String> result = cloudinaryService.uploadImage(img, "posts");
                    Post.PostImage pi = new Post.PostImage();
                    pi.setUrl(result.get("url"));
                    pi.setPublicId(result.get("publicId"));
                    post.getImages().add(pi);
                }
            }
        }

        Post saved = postRepository.save(post);

        if (req.getMentions() != null) {
            req.getMentions().forEach(mentionedUserId ->
                notificationService.createNotification(
                    mentionedUserId, userId,
                    Notification.NotificationType.MENTION,
                    saved.getId(), null, "mentioned you in a post"
                )
            );
        }
        return mapToResponse(saved, userId);
    }

    public PostResponse getPost(String postId, String currentUserId) {
        Post post = findById(postId);
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return mapToResponse(post, currentUserId);
    }

    public PostResponse updatePost(String postId, String userId, PostRequest req) {
        Post post = findById(postId);
        if (!post.getUserId().equals(userId)) {
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        }
        if (req.getCaption() != null) post.setCaption(req.getCaption());
        if (req.getHashtags() != null) post.setHashtags(req.getHashtags());
        if (req.getLocation() != null) post.setLocation(req.getLocation());
        post.setCommentsDisabled(req.isCommentsDisabled());
        post.setUpdatedAt(Instant.now());
        return mapToResponse(postRepository.save(post), userId);
    }

    public void deletePost(String postId, String userId) {
        Post post = findById(postId);
        if (!post.getUserId().equals(userId)) {
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        }
        post.setDeletedAt(Instant.now());
        postRepository.save(post);
    }

    public PageResponse<PostResponse> getFeed(String userId, int page, int size) {
        User user = userService.findById(userId);
        List<String> feedUsers = new ArrayList<>(user.getFollowing());
        feedUsers.add(userId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findFeedPosts(feedUsers, pageable);
        return buildPage(posts, userId, page, size);
    }

    public PageResponse<PostResponse> getExploreFeed(String currentUserId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findAllActivePosts(pageable);
        return buildPage(posts, currentUserId, page, size);
    }

    public PageResponse<PostResponse> getUserPosts(String userId, String currentUserId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByUserIdActive(userId, pageable);
        return buildPage(posts, currentUserId, page, size);
    }

    public void likePost(String postId, String userId) {
        Post post = findById(postId);
        post.getLikes().add(userId);
        postRepository.save(post);
        notificationService.createNotification(
            post.getUserId(), userId,
            Notification.NotificationType.LIKE,
            postId, null, "liked your post"
        );
    }

    public void unlikePost(String postId, String userId) {
        Post post = findById(postId);
        post.getLikes().remove(userId);
        postRepository.save(post);
    }

    public void savePost(String postId, String userId) {
        Post post = findById(postId);
        post.getSaves().add(userId);
        postRepository.save(post);
    }

    public void unsavePost(String postId, String userId) {
        Post post = findById(postId);
        post.getSaves().remove(userId);
        postRepository.save(post);
    }

    public PageResponse<PostResponse> getSavedPosts(String userId, int page, int size) {
        // Get all posts saved by user - paginated in memory for now
        List<Post> all = postRepository.findAll();
        List<Post> saved = all.stream()
            .filter(p -> p.getSaves().contains(userId) && p.getDeletedAt() == null)
            .sorted(Comparator.comparing(Post::getCreatedAt).reversed())
            .collect(Collectors.toList());
        int start = page * size;
        int end = Math.min(start + size, saved.size());
        List<PostResponse> content = start >= saved.size()
            ? Collections.emptyList()
            : saved.subList(start, end).stream()
                .map(p -> mapToResponse(p, userId))
                .collect(Collectors.toList());
        return PageResponse.<PostResponse>builder()
            .content(content).page(page).size(size)
            .totalElements(saved.size())
            .totalPages((int) Math.ceil((double) saved.size() / size))
            .hasNext(end < saved.size()).hasPrev(page > 0)
            .build();
    }

    public void pinPost(String postId, String userId) {
        Post post = findById(postId);
        if (!post.getUserId().equals(userId)) {
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        }
        post.setPinned(!post.isPinned());
        postRepository.save(post);
    }

    public void archivePost(String postId, String userId) {
        Post post = findById(postId);
        if (!post.getUserId().equals(userId)) {
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        }
        post.setArchived(!post.isArchived());
        postRepository.save(post);
    }

    public PageResponse<PostResponse> searchByHashtag(String hashtag, String currentUserId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByHashtag(hashtag, pageable);
        return buildPage(posts, currentUserId, page, size);
    }

    public Post findById(String id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new AppException("Post not found", HttpStatus.NOT_FOUND));
    }

    private PageResponse<PostResponse> buildPage(Page<Post> posts, String currentUserId, int page, int size) {
        return PageResponse.<PostResponse>builder()
            .content(posts.getContent().stream()
                .map(p -> mapToResponse(p, currentUserId))
                .collect(Collectors.toList()))
            .page(page).size(size)
            .totalElements(posts.getTotalElements())
            .totalPages(posts.getTotalPages())
            .hasNext(posts.hasNext()).hasPrev(page > 0)
            .build();
    }

    public PostResponse mapToResponse(Post post, String currentUserId) {
        List<String> urls = post.getImages().stream()
            .map(Post.PostImage::getUrl)
            .collect(Collectors.toList());
        return PostResponse.builder()
            .id(post.getId())
            .user(userService.getUserById(post.getUserId(), currentUserId))
            .imageUrls(urls)
            .caption(post.getCaption())
            .hashtags(post.getHashtags())
            .mentions(post.getMentions())
            .location(post.getLocation())
            .isPinned(post.isPinned())
            .isArchived(post.isArchived())
            .commentsDisabled(post.isCommentsDisabled())
            .likesCount(post.getLikes().size())
            .commentsCount(commentRepository.countByPostId(post.getId()))
            .viewCount(post.getViewCount())
            .isLiked(currentUserId != null && post.getLikes().contains(currentUserId))
            .isSaved(currentUserId != null && post.getSaves().contains(currentUserId))
            .createdAt(post.getCreatedAt())
            .build();
    }
}
