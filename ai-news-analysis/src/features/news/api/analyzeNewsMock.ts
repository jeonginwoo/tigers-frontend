// src/features/news/api/analyzeNewsMock.ts
import type { AnalyzeNewsRequest, AnalyzeNewsResponse } from "../types";

export async function analyzeNewsMock(
  payload: AnalyzeNewsRequest,
): Promise<AnalyzeNewsResponse> {
  console.log("🔥 MOCK analyzeNews 호출:", payload.article);

  // 실제 백엔드가 없을 때만 임시 사용
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    sentiment: "neutral",
    key_points: [
      "이 응답은 mock 데이터입니다.",
      "FastAPI /news/analyze 엔드포인트가 준비되면 실제 API로 전환하세요.",
      "본문 길이: " + payload.article.length + "자",
    ],
  };
}
