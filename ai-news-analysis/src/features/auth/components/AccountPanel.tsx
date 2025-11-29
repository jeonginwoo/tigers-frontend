"use client";

import { useEffect, useMemo, useState } from "react";
import { updateNickname } from "../api/authApi";
import { useAuth } from "../contexts/AuthContext";

const SKELETON_LINE = "h-3 w-24 animate-pulse rounded-full bg-muted";

export function AccountPanel() {
  const { status, account, loginUrl, refresh, logout, error } = useAuth();
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setNickname(account?.nickname ?? "");
  }, [account?.nickname]);

  const createdDate = useMemo(() => {
    if (!account?.created_at) return null;
    return new Date(account.created_at).toLocaleString("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [account?.created_at]);

  const handleSave = async () => {
    if (!nickname.trim()) {
      setMessage("닉네임을 입력해 주세요.");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      await updateNickname({ nickname: nickname.trim() });
      await refresh();
      setMessage("닉네임이 저장되었습니다.");
    } catch (err) {
      console.error(err);
      setMessage(
        err instanceof Error
          ? err.message
          : "닉네임 저장에 실패했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setMessage("로그아웃되었습니다. 다시 로그인하려면 구글 로그인을 눌러주세요.");
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-2">
              <div className={SKELETON_LINE} />
              <div className={SKELETON_LINE} />
            </div>
          </div>
          <div className="space-y-2">
            <div className={SKELETON_LINE} />
            <div className={`${SKELETON_LINE} w-32`} />
          </div>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="space-y-3 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p>{error ?? "인증 정보를 불러오지 못했습니다."}</p>
          <button
            type="button"
            onClick={() => refresh()}
            className="rounded-xl border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
          >
            다시 시도하기
          </button>
        </div>
      );
    }

    if (status === "unauthenticated") {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Google 계정으로 로그인하면 프로필 정보를 불러와 닉네임을 설정하고
            세션 상태를 확인할 수 있습니다.
          </p>
          <a
            href={loginUrl}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M21.35 11.1h-9.1v2.9h5.4c-.2 1.3-.9 2.4-2 3.1v2.6h3.2c1.9-1.8 3-4.5 3-7.6 0-.5 0-1-.1-1.5z" />
              <path d="M12.25 22c2.7 0 5-1 6.6-2.7l-3.2-2.6c-.9.6-2 1-3.4 1-2.6 0-4.7-1.7-5.4-4.1H3.45v2.6C5.1 19.9 8.4 22 12.25 22z" />
              <path d="M6.85 13.6c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.4H3.45c-.7 1.4-1.1 3-1.1 4.8s.4 3.4 1.1 4.8z" />
              <path d="M12.25 5.8c1.5 0 2.8.5 3.8 1.4l2.8-2.8C17.2 2.9 14.9 2 12.25 2 8.4 2 5.1 4.1 3.45 7.4l3.4 2.6c.7-2.4 2.8-4.2 5.4-4.2z" />
            </svg>
            Google 로그인으로 계속하기
          </a>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{account?.nickname ?? "닉네임 없음"}</p>
          <p className="text-sm text-muted-foreground">{account?.email}</p>
          {createdDate && (
            <p className="text-xs text-muted-foreground">가입일 {createdDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">
            닉네임 변경
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="새 닉네임을 입력하세요"
              className="flex-1 rounded-2xl border border-input bg-background px-4 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "저장 중..." : "닉네임 저장"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 font-semibold text-secondary">
            세션 활성화
          </span>
          <button
            type="button"
            onClick={() => refresh()}
            className="rounded-xl border border-border px-3 py-1 font-semibold text-foreground hover:bg-muted"
          >
            상태 새로고침
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-destructive/30 px-3 py-1 font-semibold text-destructive hover:bg-destructive/10"
          >
            로그아웃
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-start gap-3 border-b pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0" />
            <path d="M5 20a7 7 0 0 1 14 0" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">계정 & 세션</p>
          <p className="text-sm text-muted-foreground">
            Google OAuth 세션으로 로그인 상태를 확인하고 닉네임을 설정하세요
          </p>
        </div>
      </div>

      {renderContent()}

      {message && (
        <p className="mt-4 rounded-2xl bg-muted/50 px-4 py-3 text-xs text-foreground">
          {message}
        </p>
      )}
    </section>
  );
}
