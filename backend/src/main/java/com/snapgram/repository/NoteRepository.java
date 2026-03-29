package com.snapgram.repository;

import com.snapgram.model.Note;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface NoteRepository extends MongoRepository<Note, String> {

    Optional<Note> findByUserId(String userId);

    List<Note> findByUserIdInAndExpiresAtAfter(List<String> userIds, Instant now);

    List<Note> findByExpiresAtBefore(Instant now);
}
