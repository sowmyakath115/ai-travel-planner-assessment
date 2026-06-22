"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plane } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-semibold text-slate-950">
          <span className="rounded-2xl bg-slate-950 p-2 text-white"><Plane size={18} /></span>
          AtlasMind
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="hidden text-slate-600 sm:block">Hi, {user.name}</span>
              <Link className="rounded-full border border-slate-200 px-4 py-2 font-medium hover:bg-slate-50" href="/trips/new">
                New trip
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="rounded-full bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="rounded-full px-4 py-2 font-medium hover:bg-slate-100" href="/login">Login</Link>
              <Link className="rounded-full bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800" href="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
