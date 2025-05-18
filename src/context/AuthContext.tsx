import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

interface User {
  id: string;
  username: string;
  role: "admin" | "owner";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (username: string, password: string, role: "admin" | "owner") => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  role: null,
  login: async () => false,
  logout: () => {},
  isLoading: true
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage for existing session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    if (token && savedRole && userId && username) {
      setRole(savedRole);
      setUser({
        id: userId,
        username,
        role: savedRole as "admin" | "owner"
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, userRole: "admin" | "owner"): Promise<boolean> => {
    setIsLoading(true);
    try {
      const endpoint = userRole === "admin" ? "/auth/admin/login" : "/auth/owner/login";
      const response = await api.post(endpoint, { username, password });
      const authData = response.data;

      console.log(`${userRole} login response:`, authData);

      if (!authData || !authData.token) {
        toast.error(`Invalid ${userRole} credentials`);
        setIsLoading(false);
        return false;
      }

      const userData = userRole === "admin" ? authData.admin : authData.owner;

      if (!userData || !userData.id) {
        toast.error("Login data invalid");
        setIsLoading(false);
        return false;
      }

      // Save to localStorage
      localStorage.setItem("token", authData.token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("username", userData.username);

      // Set token to Axios header
      api.defaults.headers.common["Authorization"] = `Bearer ${authData.token}`;

      // Set state
      setUser({
        id: userData.id,
        username: userData.username,
        role: userRole
      });

      setRole(userRole);
      toast.success(`${userRole} login successful`);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setRole(null);
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
