package com.snapgram.repository;

import com.snapgram.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {

    // Fields match the Post model: 'archived', 'draft', 'pinned' (no 'is' prefix)
    @Query("{ 'userId': ?0, 'archived': false, 'draft': false, 'deletedAt': null }")
    Page<Post> findByUserIdActive(String userId, Pageable pageable);

    @Query("{ 'userId': { $in: ?0 }, 'archived': false, 'draft': false, 'deletedAt': null }")
    Page<Post> findFeedPosts(List<String> userIds, Pageable pageable);

    @Query("{ 'archived': false, 'draft': false, 'deletedAt': null }")
    Page<Post> findAllActivePosts(Pageable pageable);

    @Query("{ 'hashtags': { $regex: ?0, $options: 'i' }, 'archived': false, 'deletedAt': null }")
    Page<Post> findByHashtag(String hashtag, Pageable pageable);

    @Query("{ 'userId': ?0, 'archived': true, 'deletedAt': null }")
    List<Post> findArchivedByUserId(String userId);

    @Query(value = "{ 'userId': ?0, 'deletedAt': null }", count = true)
    long countActiveByUserId(String userId);
}
