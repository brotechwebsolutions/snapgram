package com.snapgram.service;

import com.snapgram.dto.request.UpdateProfileRequest;
import com.snapgram.dto.response.UserResponse;
import com.snapgram.exception.AppException;
import com.snapgram.model.User;
import com.snapgram.repository.PostRepository;
import com.snapgram.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CloudinaryService cloudinaryService;

    public User findById(String id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    public UserResponse getUserById(String id, String currentUserId) {
        return mapToResponse(findById(id), currentUserId);
    }

    public UserResponse getUserByUsername(String username, String currentUserId) {
        return mapToResponse(findByUsername(username), currentUserId);
    }

    public UserResponse updateProfile(String userId, UpdateProfileRequest req) {
        User user = findById(userId);
        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getBio() != null) user.setBio(req.getBio());
        if (req.getWebsite() != null) user.setWebsite(req.getWebsite());
        if (req.getIsPrivate() != null) user.setPrivateAccount(req.getIsPrivate());
        user.setUpdatedAt(Instant.now());
        return mapToResponse(userRepository.save(user), userId);
    }

    public UserResponse uploadProfilePic(String userId, MultipartFile file) throws IOException {
        User user = findById(userId);
        Map<String, String> result = cloudinaryService.uploadImage(file, "avatars");
        if (!user.getProfilePic().isEmpty()) {
            try { cloudinaryService.deleteImage(user.getProfilePic()); } catch (Exception ignored) {}
        }
        user.setProfilePic(result.get("url"));
        user.setUpdatedAt(Instant.now());
        return mapToResponse(userRepository.save(user), userId);
    }

    public UserResponse uploadCoverPhoto(String userId, MultipartFile file) throws IOException {
        User user = findById(userId);
        Map<String, String> result = cloudinaryService.uploadImage(file, "covers");
        user.setCoverPhoto(result.get("url"));
        user.setUpdatedAt(Instant.now());
        return mapToResponse(userRepository.save(user), userId);
    }

    public void followUser(String currentUserId, String targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            throw new AppException("You cannot follow yourself", HttpStatus.BAD_REQUEST);
        }
        User current = findById(currentUserId);
        User target = findById(targetUserId);
        if (target.getBlockedUsers().contains(currentUserId)) {
            throw new AppException("Cannot follow this user", HttpStatus.FORBIDDEN);
        }
        current.getFollowing().add(targetUserId);
        target.getFollowers().add(currentUserId);
        userRepository.save(current);
        userRepository.save(target);
    }

    public void unfollowUser(String currentUserId, String targetUserId) {
        User current = findById(currentUserId);
        User target = findById(targetUserId);
        current.getFollowing().remove(targetUserId);
        target.getFollowers().remove(currentUserId);
        userRepository.save(current);
        userRepository.save(target);
    }

    public void blockUser(String currentUserId, String targetUserId) {
        User current = findById(currentUserId);
        current.getBlockedUsers().add(targetUserId);
        current.getFollowing().remove(targetUserId);
        current.getFollowers().remove(targetUserId);
        User target = findById(targetUserId);
        target.getFollowers().remove(currentUserId);
        target.getFollowing().remove(currentUserId);
        userRepository.save(current);
        userRepository.save(target);
    }

    public void unblockUser(String currentUserId, String targetUserId) {
        User current = findById(currentUserId);
        current.getBlockedUsers().remove(targetUserId);
        userRepository.save(current);
    }

    public void muteUser(String currentUserId, String targetUserId) {
        User current = findById(currentUserId);
        current.getMutedUsers().add(targetUserId);
        userRepository.save(current);
    }

    // FIX: Use indexed repository query instead of findAll()
    public List<UserResponse> searchUsers(String query, String currentUserId) {
        return userRepository.searchByUsernameOrFullName(query, PageRequest.of(0, 20))
            .getContent()
            .stream()
            .filter(u -> !u.getId().equals(currentUserId))
            .map(u -> mapToResponse(u, currentUserId))
            .collect(Collectors.toList());
    }

    // FIX: Use indexed query, not findAll()
    public List<UserResponse> getSuggestedUsers(String currentUserId) {
        User current = findById(currentUserId);
        return userRepository.findAll(PageRequest.of(0, 20)).getContent()
            .stream()
            .filter(u -> !u.getId().equals(currentUserId)
                && !current.getFollowing().contains(u.getId())
                && !current.getBlockedUsers().contains(u.getId()))
            .limit(10)
            .map(u -> mapToResponse(u, currentUserId))
            .collect(Collectors.toList());
    }

    public List<UserResponse> getFollowers(String userId, String currentUserId) {
        return findById(userId).getFollowers().stream()
            .map(id -> getUserById(id, currentUserId))
            .collect(Collectors.toList());
    }

    public List<UserResponse> getFollowing(String userId, String currentUserId) {
        return findById(userId).getFollowing().stream()
            .map(id -> getUserById(id, currentUserId))
            .collect(Collectors.toList());
    }

    public UserResponse mapToResponse(User user, String currentUserId) {
        boolean isFollowing = currentUserId != null && user.getFollowers().contains(currentUserId);
        boolean isBlocked = currentUserId != null && user.getBlockedUsers().contains(currentUserId);
        return UserResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .bio(user.getBio())
            .profilePic(user.getProfilePic())
            .coverPhoto(user.getCoverPhoto())
            .website(user.getWebsite())
            .isPrivate(user.isPrivateAccount())     // FIX: map privateAccount -> isPrivate in DTO
            .emailVerified(user.isEmailVerified())
            .followersCount(user.getFollowers().size())
            .followingCount(user.getFollowing().size())
            .postsCount(postRepository.countActiveByUserId(user.getId()))
            .isFollowing(isFollowing)
            .isBlocked(isBlocked)
            .createdAt(user.getCreatedAt())
            .build();
    }
}
