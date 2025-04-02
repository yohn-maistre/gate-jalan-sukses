
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email?: string;
  name?: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem("jalanSuksesUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    try {
      // In a real app, this would call an authentication API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        email,
        name: email.split("@")[0],
        isGuest: false
      };
      setUser(newUser);
      localStorage.setItem("jalanSuksesUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    // Simulate API call
    setIsLoading(true);
    try {
      // In a real app, this would call the Google OAuth API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        email: "user@example.com",
        name: "Demo User",
        isGuest: false
      };
      setUser(newUser);
      localStorage.setItem("jalanSuksesUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = () => {
    const guestUser = {
      id: "guest_" + Math.random().toString(36).substring(2, 9),
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem("jalanSuksesUser", JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jalanSuksesUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, continueAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
