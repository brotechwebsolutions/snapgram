package com.snapgram.repository;

import com.snapgram.model.Collection;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CollectionRepository extends MongoRepository<Collection, String> {

    List<Collection> findByUserId(String userId);
}
