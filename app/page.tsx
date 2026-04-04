"use client";

import { ItemMotion, PageMotion, m, softHover } from "@/components/motion-primitives";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fde68a,_#f8fafc_36%,_#cbd5e1)] px-6 py-12 dark:bg-[radial-gradient(circle_at_top,_#1e293b,_#020617_42%,_#020617)]">
      <PageMotion className="w-full max-w-4xl rounded-[2.5rem] border border-white/60 bg-white/90 p-10 shadow-2xl shadow-slate-300/40 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/40">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <ItemMotion>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700 dark:text-amber-300">
              Voxify
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              Chat first. Calls next.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Your auth flow, direct chat APIs, presence, and realtime socket
              layer are ready to connect. Jump into the app and keep building from
              a usable foundation instead of a blank starter page.
            </p>
          </ItemMotion>

          <ItemMotion className="rounded-4xl bg-slate-950 p-6 text-white dark:border dark:border-white/10 dark:bg-slate-900">
            <p className="text-sm text-slate-300 dark:text-slate-400">
              Phase 1 now includes login, signup, users, conversations, and
              protected realtime sockets.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <m.a
                href="/login"
                className="rounded-2xl bg-amber-400 px-4 py-3 text-center font-medium text-slate-950"
                {...softHover}
              >
                Go to Login
              </m.a>
              <m.a
                href="/signup"
                className="rounded-2xl border border-white/15 px-4 py-3 text-center font-medium text-white"
                {...softHover}
              >
                Create Account
              </m.a>
            </div>
          </ItemMotion>
        </div>
      </PageMotion>
    </main>
  );
}
