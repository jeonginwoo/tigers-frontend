// src/features/news/hooks/useAnalyzeNews.ts
"use client";

import { useCallback, useState } from "react";
import type { AnalyzeNewsResponse } from "../types";
import { analyzeNewsApi } from "../api/analyzeNewsApi";
import { analyzeNewsMock } from "../api/analyzeNewsMock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function useAnalyzeNews() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeNewsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (article: string) => {
    const trimmed = article.trim();
    if (!trimmed) {
      setError("분석할 기사 내용을 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fn = USE_MOCK ? analyzeNewsMock : analyzeNewsApi;
      const response = await fn({ article: trimmed });
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "뉴스 분석 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    loading,
    result,
    error,
    analyze,
    reset,
  };
}
