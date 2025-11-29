// src/features/documents/types.ts

// 백엔드 Document.result(JSON)을 그대로 담기 위한 타입
export interface DocumentAnalysisResult {
  [key: string]: unknown;
}

/**
 * FastAPI Document 도메인 모델에 대응하는 타입
 * - file_name   → fileName
 * - s3_key      → s3Key
 * - uploader_id → uploaderId
 * - uploaded_at → uploadedAt
 * - updated_at  → updatedAt
 *
 * status는 아직 백엔드에 없으므로,
 * result 유무를 기반으로 프론트에서 간단히 추론해서 사용한다.
 */
export interface DocumentSummary {
  id: number;
  fileName: string;
  s3Key: string;
  uploaderId: number;
  uploadedAt: string; // ISO string
  updatedAt: string;  // ISO string
  result?: DocumentAnalysisResult | null;

  // 프론트 전용 편의 필드
  title?: string;
  status?: "processing" | "done"; // TODO: 나중에 백엔드에서 status 필드가 생기면 교체
}
