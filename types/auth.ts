export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
  newPassword: string;
}

export interface MeResponse {
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}
