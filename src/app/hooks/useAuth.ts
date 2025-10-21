"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  page?: {
    slug: string;
    avatarUrl?: string | null;
  } | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const user = await response.json();
        setAuthState({ user, loading: false });
      } else {
        // 401 é esperado quando não está logado - não é um erro
        setAuthState({ user: null, loading: false });
      }
    } catch (error) {
      // Apenas loga erros reais (não 401)
      console.error("Error verifying authentication:", error);
      setAuthState({ user: null, loading: false });
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setAuthState({ user: data.user, loading: false });
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (response.ok) {
      setAuthState({ user: data.user, loading: false });
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuthState({ user: null, loading: false });

      // Redirect after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
      setAuthState({ user: null, loading: false });
      window.location.href = "/";
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    login,
    signup,
    logout,
  };
}
