"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "../../components/auth/AuthProvider";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Navbar } from "../../components/common/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      await login(String(formData.get("email")), String(formData.get("password")));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-md px-4 py-16">
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-slate-600">Login to manage your private travel plans.</p>
          <div className="mt-6 space-y-4">
            <ErrorMessage message={error} />
            <label className="block text-sm font-medium">Email<input name="email" type="email" required className="mt-2 w-full rounded-2xl border-slate-300" /></label>
            <label className="block text-sm font-medium">Password<input name="password" type="password" required className="mt-2 w-full rounded-2xl border-slate-300" /></label>
            <button disabled={submitting} className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:opacity-60">
              {submitting ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-sm text-slate-600">New here? <Link href="/register" className="font-semibold text-slate-950">Create an account</Link></p>
          </div>
        </form>
      </section>
    </main>
  );
}
