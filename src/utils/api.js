import axios from "axios";
import useAuthStore from "@/store/useAuthStore"; // Ensure this path is correct

// 1. DYNAMIC CONFIGURATION
// Automatically switches based on NODE_ENV (development vs production)
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.yourdomain.com/api/v1"
    : "http://localhost:5000/api/v1");

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15s is safer for slower mobile networks
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CRITICAL: Allows cookies to be sent/received (for refresh tokens)
});

// 2. REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // We access the store safely here
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. RESPONSE INTERCEPTOR (With Silent Refresh Logic)
// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue = [];

// Helper to retry failed requests after a successful refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response; // Return full response (headers, status, data)
  },
  async (error) => {
    const originalRequest = error.config;

    // IF 401 (Unauthorized) AND we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        // If already refreshing, queue this request to run when done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ATTEMPT REFRESH
        // We rely on the HttpOnly cookie here, so no body data needed usually
        const { data } = await api.post("/auth/refresh/");

        const newAccessToken = data.accessToken;

        // Update Zustand Store
        useAuthStore.getState().setAuth(data.user, newAccessToken);

        // Process any other requests that failed while we were refreshing
        processQueue(null, newAccessToken);

        // Retry the ORIGINAL request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // If refresh fails (e.g. token completely expired), log out user
        processQueue(refreshError, null);
        useAuthStore.getState().logout();

        // Only redirect on client side
        if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors (403, 500)
    if (error.response?.status === 403) {
      console.error("Permission Denied");
    }

    return Promise.reject(error);
  }
);

export default api;