"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, router, user]);

  if (loading) {
    return <div className="mx-auto mt-20 max-w-md rounded-3xl bg-white p-8 text-center shadow-soft">Loading your workspace...</div>;
  }

  if (!user) return null;

  return <>{children}</>;
}
