// src/features/news/api/analyzeNewsApi.ts
import type { AnalyzeNewsRequest, AnalyzeNewsResponse } from "../types";

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost").replace(
    /\/$/,
    "",
  );

// 공통 응답 처리
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = "뉴스 분석 요청 처리 중 오류가 발생했습니다.";

    try {
      const data = (await res.json()) as { detail?: string; message?: string };
      message = data.detail ?? data.message ?? message;
    } catch {
      // JSON 파싱 실패 시 기본 메시지 유지
    }

    throw new Error(message);
  }

  return (await res.json()) as T;
}

// 실제 FastAPI /news/analyze 호출
export async function analyzeNewsApi(
  payload: AnalyzeNewsRequest,
): Promise<AnalyzeNewsResponse> {
  const res = await fetch(`${API_BASE_URL}/news/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 세션 쿠키 전송
    body: JSON.stringify(payload),
  });

  return handleResponse<AnalyzeNewsResponse>(res);
}
