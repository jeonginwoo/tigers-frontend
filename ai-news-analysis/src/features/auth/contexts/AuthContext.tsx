"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getAuthStatus,
  getLoginUrl,
  getMyAccount,
  logoutSession,
} from "../api/authApi";
import type { AccountProfile } from "../types";

interface AuthContextValue {
  status: "loading" | "unauthenticated" | "authenticated" | "error";
  account: AccountProfile | null;
  error: string | null;
  loginUrl: string;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchAccountWhenLoggedIn() {
  const status = await getAuthStatus();

  if (!status.logged_in) {
    return { status: "unauthenticated" as const, account: null };
  }

  const account = await getMyAccount();
  return { status: "authenticated" as const, account };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AccountProfile | null>(null);
  const [status, setStatus] = useState<
    "loading" | "unauthenticated" | "authenticated" | "error"
  >("loading");
  const [error, setError] = useState<string | null>(null);
  const loginUrl = useMemo(() => getLoginUrl(), []);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const next = await fetchAccountWhenLoggedIn();
      setAccount(next.account);
      setStatus(next.status);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "인증 정보를 불러오는 중 문제가 발생했습니다.",
      );
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } catch (err) {
      console.error(err);
    } finally {
      setAccount(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value: AuthContextValue = useMemo(
    () => ({
      status,
      account,
      error,
      loginUrl,
      refresh,
      logout,
    }),
    [account, error, loginUrl, logout, refresh, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
