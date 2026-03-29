import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    if (status === 401) {
      // Token expired or invalid — clear session and redirect to login
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      if (!window.location.pathname.startsWith("/login")
          && !window.location.pathname.startsWith("/signup")) {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      toast.error("You don't have permission to do that");
    } else if (status === 404) {
      // Suppress 404 toasts — components handle these themselves
    } else if (status === 429) {
      toast.error("Too many requests. Please wait a moment.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (status >= 400) {
      toast.error(message);
    } else if (!error.response) {
      // Network error
      toast.error("Network error. Check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
