
import api from "./api";
import { toast } from "sonner";

export interface User {
  id: string;
  username: string;
  role: "admin" | "owner";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const loginAdmin = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await api.post<AuthResponse>("/auth/admin/login", { username, password });
    const authData = response.data;
    console.log("Admin login response:", authData);
    
    
    if (!authData || !authData.token) {
      toast.error("Invalid admin credentials");
      return false;
    }
    
    localStorage.setItem("token", authData.token);
    localStorage.setItem("role", "admin");
    localStorage.setItem("userId", authData.user.id);
    
    toast.success("Admin login successful");
    window.location.href = "/";
    return true;
  } catch (error) {
    return false;
  }
};

export const loginOwner = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await api.post<AuthResponse>("/auth/owner/login", { username, password });
    const authData = response.data;
    
    if (!authData || !authData.token) {
      toast.error("Invalid owner credentials");
      return false;
    }
    
    localStorage.setItem("token", authData.token);
    localStorage.setItem("role", "owner");
    localStorage.setItem("userId", authData.user.id);
    
    toast.success("Owner login successful");
    window.location.href = "/owner/dashboard";
    return true;
  } catch (error) {
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  toast.info("You have been logged out");
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const getRole = (): string | null => {
  return localStorage.getItem("role");
};

export const getUserId = (): string | null => {
  return localStorage.getItem("userId");
};
