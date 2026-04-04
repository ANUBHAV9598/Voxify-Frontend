import {
  apiRequest,
} from "./api";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  MeResponse,
  SignupPayload,
} from "@/types/auth";

export const signup = async (payload: SignupPayload) => {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: payload,
  });
};

export const login = async (payload: LoginPayload) => {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
};

export const getMe = async () =>
  apiRequest<MeResponse>("/auth/me", {
    method: "GET",
  });

export const forgotPassword = async (payload: ForgotPasswordPayload) =>
  apiRequest<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });

export const getAuthToken = () => null;

export const logout = () =>
  apiRequest<MessageResponse>("/auth/logout", {
    method: "POST",
  });
