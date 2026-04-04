"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import VoxLoader from "@/components/VoxLoader";
import CallNotification from "@/components/call/CallNotification";

/**
 * Wraps any page that requires authentication.
 * Shows the branded VoxLoader while auth resolves;
 * unauthenticated visitors are redirected to /login.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <VoxLoader fullScreen label="Loading..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <CallNotification />
      {children}
    </>
  );
}

