// src/features/news/types.ts

// 백엔드에서 사용하는 감정 분석 결과 (예시: positive/neutral/negative)
export type Sentiment = "positive" | "neutral" | "negative";

// 요청 바디: { "article": "..." }
export interface AnalyzeNewsRequest {
  article: string;
}

// 응답 바디: { "sentiment": "...", "key_points": [...] }
export interface AnalyzeNewsResponse {
  sentiment: Sentiment;
  key_points: string[]; // 핵심 포인트 문자열 배열

  // 필요하면 백엔드에서 추가되는 필드를 위해 여유롭게 열어둘 수 있음
  // [key: string]: unknown;
}
