"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "../../components/auth/AuthProvider";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Navbar } from "../../components/common/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      await register(String(formData.get("name")), String(formData.get("email")), String(formData.get("password")));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-md px-4 py-16">
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-slate-600">Each account gets a separate protected travel workspace.</p>
          <div className="mt-6 space-y-4">
            <ErrorMessage message={error} />
            <label className="block text-sm font-medium">Name<input name="name" required minLength={2} className="mt-2 w-full rounded-2xl border-slate-300" /></label>
            <label className="block text-sm font-medium">Email<input name="email" type="email" required className="mt-2 w-full rounded-2xl border-slate-300" /></label>
            <label className="block text-sm font-medium">Password<input name="password" type="password" required minLength={8} className="mt-2 w-full rounded-2xl border-slate-300" /></label>
            <button disabled={submitting} className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:opacity-60">
              {submitting ? "Creating account..." : "Register"}
            </button>
            <p className="text-center text-sm text-slate-600">Already registered? <Link href="/login" className="font-semibold text-slate-950">Login</Link></p>
          </div>
        </form>
      </section>
    </main>
  );
}
