package com.snapgram.repository;

import com.snapgram.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByVerifyToken(String token);

    Optional<User> findByResetToken(String token);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    // FIX: Use indexed query instead of findAll() for search
    @Query("{ $or: [ { 'username': { $regex: ?0, $options: 'i' } }, { 'fullName': { $regex: ?0, $options: 'i' } } ] }")
    Page<User> searchByUsernameOrFullName(String query, Pageable pageable);
}
