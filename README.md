# SnapGram — Full-Stack Social Media App

A complete, production-ready Instagram-like social media platform built with **Spring Boot + React**.

## 🌟 Features

### Authentication
- JWT-based signup/login/logout
- BCrypt password hashing
- Email verification (token-based, 24h expiry)
- Forgot/reset password flow
- Change password
- Account lock after 5 failed attempts
- Login history tracking

### User & Profile
- Edit profile (name, bio, website, privacy)
- Profile/cover photo upload via Cloudinary
- Follow/unfollow users
- Block/mute users
- Suggested users
- Private account toggle
- Multi-device session support

### Posts
- Upload single or multiple images (Cloudinary)
- Caption with hashtags (#) and mentions (@)
- Location tagging
- Edit, soft delete, pin, archive posts
- Draft posts support
- Double-tap to like

### Feed
- Following feed + explore/global feed
- Infinite scroll pagination
- Sort by latest

### Engagement
- Like/unlike with real-time count
- Nested comments with threaded replies
- Pin/delete comments
- Disable comments per post
- Save/unsave posts

### Stories (24h)
- Upload image/video stories
- Auto-delete after 24 hours (scheduled job)
- Story viewer list
- React to stories (❤️😂🔥😮😢)
- Reply to stories via DM

### Messaging
- 1:1 real-time chat (WebSockets + STOMP)
- Typing indicators
- Message status (sent/delivered/seen)
- Send images in chat
- Delete messages

### Notifications
- Like, comment, follow, mention notifications
- Real-time push via WebSockets
- Mark as read / clear all
- Unread badge count

### Explore & Search
- Search users, hashtags, posts
- Trending hashtag chips
- Explore grid (infinite scroll)

### Security
- JWT filter on all protected routes
- CORS configured
- Rate limiting (bucket4j)
- Global exception handling

### Background Jobs (Scheduled)
- Delete expired stories (every hour)
- Delete expired notes (every hour)
- Clean expired tokens (daily at 3 AM)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2 |
| Auth | Spring Security + JWT (jjwt) |
| Database | MongoDB Atlas |
| Real-time | WebSockets (STOMP) |
| Media | Cloudinary |
| Email | Gmail SMTP |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| HTTP | Axios |
| State | React Context API |
| Routing | React Router v6 |
| Deploy BE | Render |
| Deploy FE | Vercel |

---

## 📁 Project Structure

```
snapgram/
├── backend/                          # Spring Boot app
│   ├── src/main/java/com/snapgram/
│   │   ├── config/                   # Security, WebSocket, Cloudinary, CORS
│   │   ├── controller/               # REST endpoints
│   │   ├── service/                  # Business logic
│   │   ├── repository/               # MongoDB queries
│   │   ├── model/                    # MongoDB documents
│   │   ├── dto/                      # Request/Response DTOs
│   │   ├── security/                 # JWT filter + UserDetails
│   │   ├── scheduler/                # Background cleanup jobs
│   │   ├── exception/                # Global error handling
│   │   └── websocket/                # STOMP WebSocket controller
│   └── src/main/resources/
│       └── application.yml           # App configuration
│
├── frontend/                         # React + Vite app
│   ├── src/
│   │   ├── api/                      # Axios instance + all endpoints
│   │   ├── context/                  # Auth, Theme, Socket contexts
│   │   ├── components/
│   │   │   ├── layout/               # Sidebar, MobileNav, Headers
│   │   │   ├── post/                 # PostCard, PostGrid, CreatePost
│   │   │   ├── story/                # StoryBar, StoryViewer, Upload
│   │   │   ├── chat/                 # ChatWindow, ConversationList
│   │   │   ├── profile/              # ProfileHeader, SuggestedUsers
│   │   │   └── ui/                   # Avatar, Modal, Button, Skeleton
│   │   ├── hooks/                    # useInfiniteScroll, useDebounce
│   │   ├── pages/                    # All route pages
│   │   └── utils/                    # formatDate, helpers
│   └── public/
│
├── render.yaml                       # Render deployment config
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env` or Render dashboard)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/snapgram
JWT_SECRET=min-32-char-secret-key-here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=your_secret
MAIL_USERNAME=yourapp@gmail.com
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx   # Gmail App Password
FRONTEND_URL=https://yourapp.vercel.app
PORT=8080
```

### Frontend (`frontend/.env.local`)
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_WS_URL=wss://your-backend.onrender.com/ws
```

---

## 🚀 Local Development Setup

### Prerequisites
- Java 17+ (JDK)
- Node.js 18+
- Maven (or use `./mvnw` wrapper)
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Gmail account with App Password

### 1. MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com → Create free cluster
2. Create database user (username + password)
3. Allow IP: `0.0.0.0/0` in Network Access
4. Copy connection string → use as `MONGODB_URI`

### 2. Cloudinary Setup
1. Sign up at https://cloudinary.com
2. Dashboard → copy Cloud Name, API Key, API Secret
3. Create folders: `snapgram/posts`, `snapgram/avatars`, `snapgram/stories`

### 3. Gmail SMTP Setup
1. Google Account → Security → 2-Step Verification (enable)
2. Security → App passwords → Create for "Mail"
3. Use generated 16-char password as `MAIL_PASSWORD`

### 4. Run Backend
```bash
cd backend
cp .env.example .env   # Fill in your values
# Set env vars in your shell or use IDE
./mvnw spring-boot:run
# Backend starts on http://localhost:8080
```

### 5. Run Frontend
```bash
cd frontend
cp .env.example .env.local   # Fill in values
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 🌐 Deployment

### Deploy Backend to Render
1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `cd backend && ./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar backend/target/snapgram-backend-0.0.1-SNAPSHOT.jar`
   - **Environment:** Java
5. Add all env vars in Render dashboard
6. Deploy → copy your Render URL

### Deploy Frontend to Vercel
1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
4. Add env vars:
   - `VITE_API_URL` = `https://your-render-app.onrender.com/api`
   - `VITE_WS_URL` = `wss://your-render-app.onrender.com/ws`
5. Deploy!

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/signup | No |
| POST | /api/auth/login | No |
| POST | /api/auth/verify-email?token= | No |
| POST | /api/auth/forgot-password | No |
| POST | /api/auth/reset-password | No |
| POST | /api/auth/resend-verification | Yes |
| PUT | /api/auth/change-password | Yes |
| GET | /api/auth/me | Yes |

### Users
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/users/{id} | Optional |
| PUT | /api/users/me | Yes |
| POST | /api/users/me/avatar | Yes |
| POST | /api/users/me/cover | Yes |
| GET | /api/users/search?q= | Optional |
| GET | /api/users/suggestions | Yes |
| POST | /api/users/{id}/follow | Yes |
| DELETE | /api/users/{id}/follow | Yes |
| POST | /api/users/{id}/block | Yes |
| GET | /api/users/{id}/followers | Yes |
| GET | /api/users/{id}/following | Yes |

### Posts
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/posts | Yes |
| GET | /api/posts/feed | Yes |
| GET | /api/posts/explore | Optional |
| GET | /api/posts/{id} | Optional |
| PUT | /api/posts/{id} | Yes |
| DELETE | /api/posts/{id} | Yes |
| POST | /api/posts/{id}/like | Yes |
| DELETE | /api/posts/{id}/like | Yes |
| POST | /api/posts/{id}/save | Yes |
| GET | /api/posts/saved | Yes |
| POST | /api/posts/{id}/pin | Yes |
| POST | /api/posts/{id}/archive | Yes |

### Comments
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/posts/{id}/comments | Yes |
| GET | /api/posts/{id}/comments | Optional |
| DELETE | /api/comments/{id} | Yes |
| POST | /api/comments/{id}/like | Yes |
| POST | /api/comments/{id}/pin | Yes |

### Stories
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/stories | Yes |
| GET | /api/stories/feed | Yes |
| POST | /api/stories/{id}/view | Yes |
| POST | /api/stories/{id}/react | Yes |
| DELETE | /api/stories/{id} | Yes |

### Messages
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/conversations | Yes |
| POST | /api/conversations | Yes |
| GET | /api/conversations/{id}/messages | Yes |
| POST | /api/conversations/{id}/messages | Yes |
| DELETE | /api/messages/{id} | Yes |

### Notifications
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/notifications | Yes |
| GET | /api/notifications/unread-count | Yes |
| PUT | /api/notifications/read-all | Yes |
| DELETE | /api/notifications | Yes |

### Search
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/search?q=&type= | Optional |

---

## 🔌 WebSocket Events

Connect to: `wss://your-backend/ws` (SockJS)

| Subscribe Topic | Description |
|-----------------|-------------|
| /user/{userId}/queue/messages | Incoming chat messages |
| /user/{userId}/queue/notifs | Real-time notifications |
| /topic/typing/{conversationId} | Typing indicators |

| Publish To | Description |
|------------|-------------|
| /app/chat.send | Send a message |
| /app/chat.typing | Broadcast typing status |
| /app/chat.seen | Mark messages seen |

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| CORS error | Set `FRONTEND_URL` env var correctly on backend |
| Email not sending | Use Gmail App Password, not your account password |
| Image upload fails | Check Cloudinary credentials in env vars |
| JWT expired errors | Ensure `JWT_SECRET` is the same across restarts |
| MongoDB connection refused | Check Atlas IP whitelist includes `0.0.0.0/0` |
| WebSocket disconnects | Render free tier sleeps — upgrade to paid or use keep-alive pings |
| Build fails on Render | Ensure Java 17 is selected in Render settings |

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| Mobile (<768px) | Bottom nav, stacked feed, full-screen chat |
| Tablet (768-1024px) | Sidebar icons only, two-col messages |
| Desktop (>1024px) | Full sidebar with labels + right panel |

---

Made with ❤️ — SnapGram © 2025
