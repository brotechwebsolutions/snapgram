package com.snapgram.repository;

import com.snapgram.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    long countByRecipientIdAndReadFalse(String userId);

    List<Notification> findByRecipientId(String userId);
}
