import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  adminName: string;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  // Check if admin is already logged in (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth");
    const name = localStorage.getItem("adminName");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      if (name) setAdminName(name);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple authentication - in production, this would call an API
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      setAdminName(username);
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("adminName", username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminName("Admin");
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminName");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        adminName,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}


