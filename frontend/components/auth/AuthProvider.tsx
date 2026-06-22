"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, clearToken, setToken } from "../../lib/api";
import type { User } from "../../lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ user: User }>("/auth/me")
      .then((response) => setUser(response.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        const response = await apiRequest<{ token: string; user: User }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        setToken(response.token);
        setUser(response.user);
      },
      async register(name, email, password) {
        const response = await apiRequest<{ token: string; user: User }>("/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password })
        });
        setToken(response.token);
        setUser(response.user);
      },
      logout() {
        clearToken();
        setUser(null);
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
