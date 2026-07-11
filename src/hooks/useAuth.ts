"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { authAPI } from "@/lib/api";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setIsLoading, logout } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const { data } = await authAPI.getMe();
          setUser(data.data);
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [setUser, setIsLoading, logout]);

  return { user, isAuthenticated, isLoading, logout };
}
