package com.snapgram.service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
@Service @RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    @Value("${app.frontend-url}") private String frontendUrl;
    @Value("${spring.mail.username}") private String fromEmail;

    @Async
    public void sendVerificationEmail(String to, String username, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;
        String html = "<div style='font-family:sans-serif;max-width:600px;margin:0 auto'>" +
            "<h1 style='color:#405de6'>Welcome to SnapGram, " + username + "!</h1>" +
            "<p>Click the button below to verify your email address.</p>" +
            "<a href='" + link + "' style='background:#405de6;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block'>Verify Email</a>" +
            "<p style='color:#999;margin-top:24px'>Link expires in 24 hours. If you didn't create an account, ignore this email.</p></div>";
        sendEmail(to, "Verify your SnapGram account", html);
    }

    @Async
    public void sendPasswordResetEmail(String to, String username, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        String html = "<div style='font-family:sans-serif;max-width:600px;margin:0 auto'>" +
            "<h1 style='color:#e1306c'>Reset your password</h1>" +
            "<p>Hi " + username + ", we received a request to reset your SnapGram password.</p>" +
            "<a href='" + link + "' style='background:#e1306c;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block'>Reset Password</a>" +
            "<p style='color:#999;margin-top:24px'>Link expires in 1 hour. If you didn't request this, ignore this email.</p></div>";
        sendEmail(to, "Reset your SnapGram password", html);
    }

    private void sendEmail(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}
