
import axios from "axios";
import { toast } from "sonner";

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// List of public endpoints that don't require authentication
const publicEndpoints = [
  '/public/venues', 
  '/user/bookings', 
  '/venues/',
  '/user/confirmed-venues'
];

// Helper function to check if a URL is a public endpoint
const isPublicEndpoint = (url: string) => {
  return publicEndpoints.some(endpoint => url.includes(endpoint));
};

// Request interceptor to inject the auth token
api.interceptors.request.use((config) => {
  // Only add authorization header if it's not a public endpoint
  if (!isPublicEndpoint(config.url || '')) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    toast.error(message);
    
    // Handle authentication errors only for protected routes
    if (error.response?.status === 401 && !isPublicEndpoint(error.config.url)) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;
