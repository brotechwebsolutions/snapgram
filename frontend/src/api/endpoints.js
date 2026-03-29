import api from "./axiosInstance";

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  login:               (data)  => api.post("/auth/login", data),
  signup:              (data)  => api.post("/auth/signup", data),
  me:                  ()      => api.get("/auth/me"),
  verifyEmail:         (token) => api.post(`/auth/verify-email?token=${token}`),
  resendVerification:  ()      => api.post("/auth/resend-verification"),
  forgotPassword:      (email) => api.post("/auth/forgot-password", { email }),
  resetPassword:       (data)  => api.post("/auth/reset-password", data),
  changePassword:      (data)  => api.put("/auth/change-password", data),
};

// ── Users ─────────────────────────────────────────────────
export const userAPI = {
  /** Get user by ID (internal use) */
  getUserById:     (id)       => api.get(`/users/${id}`),

  /** Get user by USERNAME — used by Profile page */
  getUser:         (username) => api.get(`/users/by-username/${username}`),

  updateProfile:   (data)  => api.put("/users/me", data),

  uploadAvatar: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post("/users/me/avatar", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadCover: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post("/users/me/cover", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  searchUsers:    (q)  => api.get(`/users/search?q=${encodeURIComponent(q)}`),
  getSuggestions: ()   => api.get("/users/suggestions"),
  follow:         (id) => api.post(`/users/${id}/follow`),
  unfollow:       (id) => api.delete(`/users/${id}/follow`),
  block:          (id) => api.post(`/users/${id}/block`),
  unblock:        (id) => api.delete(`/users/${id}/block`),
  mute:           (id) => api.post(`/users/${id}/mute`),
  getFollowers:   (id) => api.get(`/users/${id}/followers`),
  getFollowing:   (id) => api.get(`/users/${id}/following`),
};

// ── Posts ─────────────────────────────────────────────────
export const postAPI = {
  create: (formData) =>
    api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getPost:      (id)                  => api.get(`/posts/${id}`),
  update:       (id, data)            => api.put(`/posts/${id}`, data),
  delete:       (id)                  => api.delete(`/posts/${id}`),
  getFeed:      (page = 0, size = 10) => api.get(`/posts/feed?page=${page}&size=${size}`),
  getExplore:   (page = 0, size = 20) => api.get(`/posts/explore?page=${page}&size=${size}`),
  getUserPosts: (userId, page = 0)    => api.get(`/posts/user/${userId}?page=${page}&size=12`),
  like:         (id)                  => api.post(`/posts/${id}/like`),
  unlike:       (id)                  => api.delete(`/posts/${id}/like`),
  save:         (id)                  => api.post(`/posts/${id}/save`),
  unsave:       (id)                  => api.delete(`/posts/${id}/save`),
  getSaved:     (page = 0)            => api.get(`/posts/saved?page=${page}&size=12`),
  pin:          (id)                  => api.post(`/posts/${id}/pin`),
  archive:      (id)                  => api.post(`/posts/${id}/archive`),
};

// ── Comments ──────────────────────────────────────────────
export const commentAPI = {
  add:    (postId, data)   => api.post(`/posts/${postId}/comments`, data),
  get:    (postId, page=0) => api.get(`/posts/${postId}/comments?page=${page}&size=10`),
  delete: (id)             => api.delete(`/comments/${id}`),
  like:   (id)             => api.post(`/comments/${id}/like`),
  pin:    (id)             => api.post(`/comments/${id}/pin`),
};

// ── Stories ───────────────────────────────────────────────
export const storyAPI = {
  upload: (formData) =>
    api.post("/stories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getFeed:  ()           => api.get("/stories/feed"),
  view:     (id)         => api.post(`/stories/${id}/view`),
  react:    (id, emoji)  => api.post(`/stories/${id}/react`, { emoji }),
  delete:   (id)         => api.delete(`/stories/${id}`),
};

// ── Messages ──────────────────────────────────────────────
export const messageAPI = {
  getConversations:    ()       => api.get("/conversations"),
  createConversation:  (userId) => api.post("/conversations", { userId }),

  getMessages: (id, page = 0) =>
    api.get(`/conversations/${id}/messages?page=${page}&size=30`),

  send: (id, formData) =>
    api.post(`/conversations/${id}/messages`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteMessage: (id) => api.delete(`/messages/${id}`),
};

// ── Notifications ─────────────────────────────────────────
export const notificationAPI = {
  get:            (page = 0) => api.get(`/notifications?page=${page}&size=20`),
  getUnreadCount: ()         => api.get("/notifications/unread-count"),
  markAllRead:    ()         => api.put("/notifications/read-all"),
  deleteAll:      ()         => api.delete("/notifications"),
};

// ── Search ────────────────────────────────────────────────
export const searchAPI = {
  search: (q, type = "all") =>
    api.get(`/search?q=${encodeURIComponent(q)}&type=${type}`),
};

// ── Notes ─────────────────────────────────────────────────
export const noteAPI = {
  create: (text, privacy = "followers") => api.post("/notes", { text, privacy }),
  getFeed: ()   => api.get("/notes/feed"),
  delete:  (id) => api.delete(`/notes/${id}`),
};
