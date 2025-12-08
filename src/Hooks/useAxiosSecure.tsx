// axiosSecure.ts
import axios from "axios";

export const axiosSecure = axios.create({
  baseURL: "http://localhost:5000/api",
});

// --- Request Interceptor (Add JWT automatically) ---
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor (Optional 401 handling) ---
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Token invalid or expired.");
      // you can logout user or redirect here
      // localStorage.removeItem("jwt_token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
