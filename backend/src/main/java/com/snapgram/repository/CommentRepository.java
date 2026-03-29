package com.snapgram.repository;

import com.snapgram.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {

    @Query("{ 'postId': ?0, 'parentId': null, 'deletedAt': null }")
    Page<Comment> findTopLevelByPostId(String postId, Pageable pageable);

    @Query("{ 'parentId': ?0, 'deletedAt': null }")
    List<Comment> findRepliesByParentId(String parentId);

    @Query(value = "{ 'postId': ?0, 'deletedAt': null }", count = true)
    long countByPostId(String postId);
}
