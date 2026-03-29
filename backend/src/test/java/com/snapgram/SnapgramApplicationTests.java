package com.snapgram;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.TestPropertySource;

/**
 * Basic smoke test — verifies application context loads.
 *
 * NOTE: This test is SKIPPED during Render deployment via -DskipTests.
 * To run locally, ensure MongoDB is running or set MONGODB_URI env var.
 */
@SpringBootTest(webEnvironment = WebEnvironment.NONE)
@TestPropertySource(properties = {
    "MONGODB_URI=mongodb://localhost:27017/snapgram-test",
    "JWT_SECRET=test-jwt-secret-key-minimum-32-chars-for-hmac-sha256",
    "CLOUDINARY_CLOUD_NAME=test",
    "CLOUDINARY_API_KEY=123456789",
    "CLOUDINARY_API_SECRET=test_secret",
    "MAIL_USERNAME=test@gmail.com",
    "MAIL_PASSWORD=testpassword",
    "FRONTEND_URL=http://localhost:5173",
    "BASE_URL=http://localhost:8080"
})
class SnapgramApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the Spring application context starts without errors.
        // Run with: mvn test (requires local MongoDB)
        // Skip with: mvn test -DskipTests (used in Render deployment)
    }
}
