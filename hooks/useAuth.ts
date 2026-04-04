"use client";

import { useEffect, useState } from "react";
import type { AuthUser, LoginPayload, SignupPayload } from "@/types/auth";
import { getMe, login, logout, signup } from "@/services/auth";
import { connectSocket, disconnectSocket } from "@/services/socket";

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((response) => {
        setUser(response.user);
        connectSocket();
      })
      .catch(() => {
        disconnectSocket();
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogin = async (payload: LoginPayload) => {
    const response = await login(payload);
    connectSocket();
    setUser(response.user);
    return response;
  };

  const handleSignup = async (payload: SignupPayload) => {
    const response = await signup(payload);
    connectSocket();
    setUser(response.user);
    return response;
  };

  const handleLogout = async () => {
    await logout();
    disconnectSocket();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };
};
