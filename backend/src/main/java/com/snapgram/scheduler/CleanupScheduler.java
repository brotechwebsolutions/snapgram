package com.snapgram.scheduler;

import com.snapgram.repository.NoteRepository;
import com.snapgram.repository.StoryRepository;
import com.snapgram.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CleanupScheduler {

    private final StoryRepository storyRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Scheduled(fixedRate = 3600000)  // Every hour
    public void deleteExpiredStories() {
        List<?> expired = storyRepository.findByExpiresAtBefore(Instant.now());
        if (!expired.isEmpty()) {
            storyRepository.deleteAll((List) expired);
            log.info("Deleted {} expired stories", expired.size());
        }
    }

    @Scheduled(fixedRate = 3600000)  // Every hour
    public void deleteExpiredNotes() {
        List<?> expired = noteRepository.findByExpiresAtBefore(Instant.now());
        if (!expired.isEmpty()) {
            noteRepository.deleteAll((List) expired);
            log.info("Deleted {} expired notes", expired.size());
        }
    }

    @Scheduled(cron = "0 0 3 * * *")  // Daily at 3 AM
    public void cleanExpiredTokens() {
        Instant now = Instant.now();
        userRepository.findAll().forEach(user -> {
            boolean changed = false;
            if (user.getVerifyTokenExpiry() != null && now.isAfter(user.getVerifyTokenExpiry())) {
                user.setVerifyToken(null);
                user.setVerifyTokenExpiry(null);
                changed = true;
            }
            if (user.getResetTokenExpiry() != null && now.isAfter(user.getResetTokenExpiry())) {
                user.setResetToken(null);
                user.setResetTokenExpiry(null);
                changed = true;
            }
            if (changed) userRepository.save(user);
        });
        log.info("Token cleanup completed");
    }
}
