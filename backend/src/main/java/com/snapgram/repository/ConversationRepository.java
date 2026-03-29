package com.snapgram.repository;

import com.snapgram.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String> {

    List<Conversation> findByParticipantsContainingOrderByLastMessageAtDesc(String userId);

    // FIX: Safer query - find conversation where both users are participants
    @Query("{ 'participants': { $all: [?0, ?1] } }")
    List<Conversation> findConversationsBetween(String user1, String user2);
}
