import type { AccountProfile, AuthStatusResponse } from "../types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:33333").replace(/\/$/, "");

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "요청을 처리하지 못했습니다.";

    try {
      const data = (await response.json()) as { detail?: string; message?: string };
      message = data.detail ?? data.message ?? message;
    } catch (err) {
      console.error("Failed to parse error response", err);
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  return handleResponse<T>(response);
}

export function getLoginUrl(): string {
  return `${API_BASE_URL}/authentication/google`;
}

export async function getAuthStatus(): Promise<AuthStatusResponse> {
  return request<AuthStatusResponse>("/authentication/status", {
    method: "GET",
  });
}

export async function getMyAccount(): Promise<AccountProfile> {
  return request<AccountProfile>("/accounts/me", {
    method: "GET",
  });
}

export async function updateNickname(payload: {
  nickname: string;
}): Promise<AccountProfile> {
  return request<AccountProfile>("/accounts/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function logoutSession(): Promise<void> {
  await request("/authentication/logout", {
    method: "POST",
  });
}
