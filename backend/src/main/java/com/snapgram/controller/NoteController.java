package com.snapgram.controller;

import com.snapgram.dto.response.ApiResponse;
import com.snapgram.exception.AppException;
import com.snapgram.model.Note;
import com.snapgram.repository.NoteRepository;
import com.snapgram.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteRepository noteRepository;
    private final UserService userService;

    /** Create or update the current user's note (max 1 active note per user) */
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createNote(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody Map<String, String> body) {
        String text = body.get("text");
        String privacy = body.getOrDefault("privacy", "followers");
        if (text == null || text.trim().isEmpty()) {
            throw new AppException("Note text is required", HttpStatus.BAD_REQUEST);
        }
        if (text.length() > 60) {
            throw new AppException("Note must be 60 characters or less", HttpStatus.BAD_REQUEST);
        }
        // Delete existing note if any
        noteRepository.findByUserId(ud.getUsername()).ifPresent(noteRepository::delete);

        Note note = new Note();
        note.setUserId(ud.getUsername());
        note.setText(text.trim());
        note.setPrivacy(privacy);
        note.setExpiresAt(Instant.now().plusSeconds(86400));
        Note saved = noteRepository.save(note);

        return ResponseEntity.ok(ApiResponse.ok("Note created", mapNote(saved)));
    }

    /** Get notes from people the user follows */
    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFeed(
            @AuthenticationPrincipal UserDetails ud) {
        var user = userService.findById(ud.getUsername());
        List<String> feedUsers = new ArrayList<>(user.getFollowing());
        feedUsers.add(ud.getUsername());
        List<Map<String, Object>> notes = noteRepository
            .findByUserIdInAndExpiresAtAfter(feedUsers, Instant.now())
            .stream()
            .map(n -> {
                Map<String, Object> m = mapNote(n);
                m.put("user", userService.getUserById(n.getUserId(), ud.getUsername()));
                return m;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("OK", notes));
    }

    /** Delete own note */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new AppException("Note not found", HttpStatus.NOT_FOUND));
        if (!note.getUserId().equals(ud.getUsername())) {
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        }
        noteRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Note deleted"));
    }

    private Map<String, Object> mapNote(Note n) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", n.getId());
        m.put("text", n.getText());
        m.put("privacy", n.getPrivacy());
        m.put("expiresAt", n.getExpiresAt());
        m.put("createdAt", n.getCreatedAt());
        return m;
    }
}
