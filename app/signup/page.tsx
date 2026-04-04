"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { SignupPayload } from "@/types/auth";
import { ApiError } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { ItemMotion, PageMotion, m, softHover } from "@/components/motion-primitives";

const initialForm: SignupPayload = {
  name: "",
  email: "",
  password: "",
};

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading } = useAuth();
  const [form, setForm] = useState<SignupPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/chat");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleChange = (field: keyof SignupPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signup(form);
      router.push("/chat");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,_#f8fafc,_#e0f2fe_45%,_#fef3c7)] px-6 py-12 dark:bg-[linear-gradient(160deg,_#020617,_#0f172a_45%,_#1e293b)]">
      <PageMotion className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-300/40 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/40">
        <ItemMotion className="mb-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">
            Voxify
          </p>
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight" style={{ color: "var(--foreground)" }}>
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            Start with direct chats now and add calls next.
          </p>
        </ItemMotion>

        <m.form
          onSubmit={handleSubmit}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <m.label variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="block">
            <span className="mb-1.5 block text-[13px] font-semibold" style={{ color: "var(--fg-muted)" }}>
              Name
            </span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus:bg-slate-950"
              style={{ color: "var(--foreground)" }}
              placeholder="Anubhav"
              required
            />
          </m.label>

          <m.label variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="block">
            <span className="mb-1.5 block text-[13px] font-semibold" style={{ color: "var(--fg-muted)" }}>
              Email
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus:bg-slate-950"
              style={{ color: "var(--foreground)" }}
              placeholder="you@example.com"
              required
            />
          </m.label>

          <m.label variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="block">
            <span className="mb-1.5 block text-[13px] font-semibold" style={{ color: "var(--fg-muted)" }}>
              Password
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus:bg-slate-950"
              style={{ color: "var(--foreground)" }}
              placeholder="At least 6 characters"
              required
            />
          </m.label>

          <ItemMotion>
            <m.button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-sky-700 px-4 py-3 font-medium text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-400"
              {...softHover}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </m.button>
          </ItemMotion>
        </m.form>

        <ItemMotion className="mt-6 text-sm" style={{ color: "var(--fg-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-sky-600 dark:text-sky-400 underline-offset-2 hover:underline">
            Sign in
          </Link>
        </ItemMotion>
      </PageMotion>
    </main>
  );
}
