"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";
import { forgotPassword } from "@/services/auth";
import { ApiError } from "@/services/api";
import { usePaletteTheme } from "@/components/ThemeRoot";

interface AccountDialogProps {
  currentUserEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function AccountDialog({
  currentUserEmail,
  isOpen,
  onClose,
  onLogout,
}: AccountDialogProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { palettes, selectedPalette, setSelectedPalette } = usePaletteTheme();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isPaletteDialogOpen, setIsPaletteDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState(currentUserEmail);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activePalette =
    palettes.find((palette) => palette.id === selectedPalette) ?? palettes[0];

  if (!isOpen) {
    return null;
  }

  const handleResetPassword = async () => {
    setIsSubmitting(true);

    try {
      const response = await forgotPassword({
        email: resetEmail.trim().toLowerCase(),
        newPassword,
      });

      toast.success(response.message);
      setNewPassword("");
      setIsResetDialogOpen(false);
    } catch (requestError) {
      toast.error(
        requestError instanceof ApiError
          ? requestError.message
          : "Password reset failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex items-start justify-center bg-slate-950/35 p-4 backdrop-blur-[2px]">
      <div className="mt-3 w-full max-w-[20rem] rounded-[1.4rem] border border-black/8 bg-white p-4 shadow-2xl dark:border-white/8 dark:bg-[#202c33]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Account
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage theme, password, and session.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-slate-500 transition hover:bg-black/6 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-slate-100"
          >
            x
          </button>
        </div>

        <div
          className="mt-4 rounded-[1.2rem] p-3"
          style={{ backgroundColor: "var(--panel-muted)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Theme
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                aria-label="Light mode"
                className={`flex h-10 w-10 items-center justify-center rounded-full text-base transition ${
                  resolvedTheme === "light"
                    ? "text-[var(--accent-foreground)]"
                    : "text-slate-700 dark:text-slate-200"
                }`}
                style={{
                  backgroundColor:
                    resolvedTheme === "light"
                      ? "var(--accent)"
                      : "var(--panel-surface)",
                }}
              >
                ☀
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                aria-label="Dark mode"
                className={`flex h-10 w-10 items-center justify-center rounded-full text-base transition ${
                  resolvedTheme === "dark"
                    ? "text-[var(--accent-foreground)]"
                    : "text-slate-700 dark:text-slate-200"
                }`}
                style={{
                  backgroundColor:
                    resolvedTheme === "dark"
                      ? "var(--accent)"
                      : "var(--panel-surface)",
                }}
              >
                ☾
              </button>
            </div>

            <button
              type="button"
              aria-label="Open color theme options"
              onClick={() => setIsPaletteDialogOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/80 shadow-sm transition hover:scale-105 dark:border-black/20"
              style={{ backgroundColor: activePalette.swatch }}
            >
              <span className="sr-only">Choose color theme</span>
            </button>
          </div>
        </div>

        <div className="mt-3 rounded-[1.2rem] bg-[#f7f5f3] p-3 dark:bg-[#111b21]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Forgot password
          </p>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Open a secure reset dialog to change your password.
          </p>
          <button
            type="button"
            onClick={() => {
              setResetEmail(currentUserEmail);
              setNewPassword("");
              setIsResetDialogOpen(true);
            }}
            className="mt-3 w-full rounded-xl bg-[#25d366] px-4 py-2.5 text-sm font-semibold text-[#111b21] transition hover:brightness-95"
          >
            Forgot password
          </button>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-3 w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/5 dark:border-white/8 dark:text-slate-200 dark:hover:bg-white/6"
        >
          Log out
        </button>
      </div>

      {isResetDialogOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[22rem] rounded-[1.4rem] border border-black/8 bg-white p-5 shadow-2xl dark:border-white/8 dark:bg-[#202c33]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Change password
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enter your email and a new password.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsResetDialogOpen(false)}
                className="rounded-full px-2 py-1 text-slate-500 transition hover:bg-black/6 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-slate-100"
              >
                x
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              <input
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-transparent bg-[#f7f5f3] px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#25d366] dark:bg-[#111b21] dark:text-slate-100"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="New password"
                className="w-full rounded-xl border border-transparent bg-[#f7f5f3] px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#25d366] dark:bg-[#111b21] dark:text-slate-100"
              />

            </div>

            <div className="mt-4 flex gap-2.5">
              <button
                type="button"
                onClick={() => setIsResetDialogOpen(false)}
                className="flex-1 rounded-xl border border-black/8 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/5 dark:border-white/8 dark:text-slate-200 dark:hover:bg-white/6"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleResetPassword}
                className="flex-1 rounded-xl bg-[#25d366] px-4 py-2.5 text-sm font-semibold text-[#111b21] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Updating..." : "Change password"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isPaletteDialogOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[24rem] rounded-[1.4rem] border border-black/8 bg-white p-5 shadow-2xl dark:border-white/8 dark:bg-[#202c33]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Color themes
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Scroll and pick a new look for Voxify.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPaletteDialogOpen(false)}
                className="rounded-full px-2 py-1 text-slate-500 transition hover:bg-black/6 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-slate-100"
              >
                x
              </button>
            </div>

            <div className="mt-4 max-h-[22rem] space-y-2 overflow-y-auto pr-1">
              {palettes.map((palette) => {
                const isActive = palette.id === selectedPalette;

                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => setSelectedPalette(palette.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition"
                    style={{
                      borderColor: isActive ? "var(--accent)" : "var(--divider)",
                      backgroundColor: isActive
                        ? "var(--accent-soft)"
                        : "var(--panel-muted)",
                    }}
                  >
                    <span
                      className="h-10 w-10 shrink-0 rounded-full border-2 border-white/80 shadow-sm dark:border-black/20"
                      style={{ backgroundColor: palette.swatch }}
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {palette.name}
                      </span>
                      <span className="mt-1 flex gap-1.5">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: palette.light.accent }}
                        />
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: palette.light.panelSelected }}
                        />
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: palette.dark.panelSurface }}
                        />
                      </span>
                    </span>

                    {isActive ? (
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        Active
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
