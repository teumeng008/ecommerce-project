import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await userService.getMe();
        setUser(response.user);
      } catch (error) {
        localStorage.removeItem("token");
        addToast("Session expired. Please sign in again.", "error");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [addToast]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem("token", response.token);
    setUser(response.user);
    addToast("Signed in successfully.", "success");
    return response;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    addToast("Account created. Please sign in.", "success");
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    addToast("Signed out.", "success");
  };

  const refreshProfile = async () => {
    const response = await userService.getMe();
    setUser(response.user);
    return response.user;
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshProfile }),
    [user, loading, addToast],
  );
  //children rendered here -----------------------
  //                                             V  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; // this is where all the object is being gave to AuthContext provider
}

export function useAuth() {
  const context = useContext(AuthContext); // context get all the object inside AuthContext which has been assigned
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
// TODO: understand useMemo(), process flow 