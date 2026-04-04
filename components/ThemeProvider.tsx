"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { MotionRoot, m } from "./motion-primitives";

export default function ThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="voxify-theme"
    >
      <MotionRoot>
        <ThemeToggle />
        {children}
      </MotionRoot>
    </NextThemesProvider>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <m.button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${
        resolvedTheme === "dark" ? "light" : "dark"
      } mode`}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      className="fixed top-4 right-4 z-50 flex h-11 w-20 items-center rounded-full border border-slate-200 bg-white/90 px-1 shadow-lg backdrop-blur transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/90 dark:hover:bg-slate-800"
    >
      <span className="absolute left-3 text-sm text-amber-500">☀</span>
      <span className="absolute right-3 text-sm text-slate-300 dark:text-sky-300">
        ☾
      </span>
      <m.span
        className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs text-white shadow-md transition-transform duration-300 dark:bg-amber-400 dark:text-slate-950 ${
          mounted && resolvedTheme === "dark" ? "translate-x-9" : "translate-x-0"
        }`}
        layout
      >
        {mounted ? (resolvedTheme === "dark" ? "☾" : "☀") : "•"}
      </m.span>
    </m.button>
  );
}
