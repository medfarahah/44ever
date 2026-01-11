import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authAPI } from "../services/api";

interface User {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  role: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const userStr = localStorage.getItem("userData");

        if (token && userStr) {
          try {
            const userData = JSON.parse(userStr);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (e) {
            // Invalid user data, clear it
            localStorage.removeItem("userToken");
            localStorage.removeItem("userData");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authAPI.login(email, password);
      if (response.token && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem("userToken", response.token);
        localStorage.setItem("userData", JSON.stringify(response.user));
        return { success: true };
      }
      return { success: false, error: 'Login failed. Invalid response from server.' };
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authAPI.register(name, email, password, phone);
      if (response.token && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem("userToken", response.token);
        localStorage.setItem("userData", JSON.stringify(response.user));
        return { success: true };
      }
      return { success: false, error: 'Registration failed. Invalid response from server.' };
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    authAPI.logout();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
