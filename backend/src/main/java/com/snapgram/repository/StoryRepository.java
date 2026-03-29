package com.snapgram.repository;

import com.snapgram.model.Story;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface StoryRepository extends MongoRepository<Story, String> {

    List<Story> findByUserIdAndExpiresAtAfter(String userId, Instant now);

    List<Story> findByUserIdInAndExpiresAtAfter(List<String> userIds, Instant now);

    List<Story> findByExpiresAtBefore(Instant now);

    List<Story> findByUserIdAndHighlightTrue(String userId);
}
