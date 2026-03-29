package com.snapgram.repository;

import com.snapgram.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    Page<Message> findByConversationIdOrderByCreatedAtDesc(String convId, Pageable pageable);

    @Query("{ 'conversationId': ?0, 'status': { $ne: 'SEEN' } }")
    List<Message> findUnseenByConversationId(String convId);
}
