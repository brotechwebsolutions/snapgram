package com.snapgram.service;
import com.snapgram.dto.request.*;
import com.snapgram.dto.response.*;
import com.snapgram.exception.AppException;
import com.snapgram.model.User;
import com.snapgram.repository.UserRepository;
import com.snapgram.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.UUID;
@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final UserService userService;

    public AuthResponse signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new AppException("Email already registered", HttpStatus.CONFLICT);
        if (userRepository.existsByUsername(req.getUsername()))
            throw new AppException("Username already taken", HttpStatus.CONFLICT);
        User user = new User();
        user.setUsername(req.getUsername().toLowerCase());
        user.setEmail(req.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName() != null ? req.getFullName() : req.getUsername());
        String verifyToken = UUID.randomUUID().toString();
        user.setVerifyToken(verifyToken);
        user.setVerifyTokenExpiry(Instant.now().plusSeconds(86400));
        User saved = userRepository.save(user);
        emailService.sendVerificationEmail(saved.getEmail(), saved.getUsername(), verifyToken);
        String token = jwtUtil.generateToken(saved.getId());
        return new AuthResponse(token, userService.mapToResponse(saved, null));
    }

    public AuthResponse login(LoginRequest req, String ip, String device) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase())
            .orElseThrow(() -> new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED));
        if (user.getLockedUntil() != null && Instant.now().isBefore(user.getLockedUntil()))
            throw new AppException("Account locked. Try again later.", HttpStatus.FORBIDDEN);
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= 5)
                user.setLockedUntil(Instant.now().plusSeconds(900));
            userRepository.save(user);
            throw new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        User.LoginHistory history = new User.LoginHistory();
        history.setIp(ip); history.setDevice(device);
        user.getLoginHistory().add(0, history);
        if (user.getLoginHistory().size() > 10)
            user.setLoginHistory(user.getLoginHistory().subList(0, 10));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token, userService.mapToResponse(user, null));
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByVerifyToken(token)
            .orElseThrow(() -> new AppException("Invalid token", HttpStatus.BAD_REQUEST));
        if (Instant.now().isAfter(user.getVerifyTokenExpiry()))
            throw new AppException("Token expired", HttpStatus.BAD_REQUEST);
        user.setEmailVerified(true);
        user.setVerifyToken(null);
        user.setVerifyTokenExpiry(null);
        userRepository.save(user);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
            .orElseThrow(() -> new AppException("Email not found", HttpStatus.NOT_FOUND));
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(Instant.now().plusSeconds(3600));
        userRepository.save(user);
        emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), token);
    }

    public void resetPassword(ResetPasswordRequest req) {
        User user = userRepository.findByResetToken(req.getToken())
            .orElseThrow(() -> new AppException("Invalid token", HttpStatus.BAD_REQUEST));
        if (Instant.now().isAfter(user.getResetTokenExpiry()))
            throw new AppException("Token expired", HttpStatus.BAD_REQUEST);
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    public void changePassword(String userId, ChangePasswordRequest req) {
        User user = userService.findById(userId);
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword()))
            throw new AppException("Incorrect current password", HttpStatus.BAD_REQUEST);
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    public void resendVerification(String userId) {
        User user = userService.findById(userId);
        if (user.isEmailVerified()) throw new AppException("Email already verified", HttpStatus.BAD_REQUEST);
        String token = UUID.randomUUID().toString();
        user.setVerifyToken(token);
        user.setVerifyTokenExpiry(Instant.now().plusSeconds(86400));
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), token);
    }
}
