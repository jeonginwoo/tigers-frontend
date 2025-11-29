// src/features/documents/api/documentsApi.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:33333";

/**
 * 백엔드에서 오는 원래 DTO 형태 (snake_case)
 */
type RawDocumentDto = {
  id: number;
  file_name: string;
  s3_key: string;
  file_url: string;
  uploader_id: number;
  uploaded_at: string | null;
  updated_at: string | null;
  status: "processing" | "completed" | "failed" | null;
  result: any | null;
};

/**
 * 프런트에서 사용하는 문서 타입 (camelCase)
 * useDocuments.ts의 DocumentSummary와 맞춰서 정의
 */
export interface DocumentSummary {
  id: number;
  fileName: string;
  s3Key: string;
  fileUrl: string;
  uploaderId: number;
  uploadedAt: string | null;
  updatedAt: string | null;
  status: "processing" | "completed" | "failed" | null;
  result: any | null;
  // title은 백엔드에서 안 주니까, 필요하면 fileName 기반으로 UI에서 생성
  title?: string;
}

/** 백엔드 DTO → 프런트 타입 매핑 함수 */
function mapDocument(raw: RawDocumentDto): DocumentSummary {
  return {
    id: raw.id,
    fileName: raw.file_name,
    s3Key: raw.s3_key,
    fileUrl: raw.file_url,
    uploaderId: raw.uploader_id,
    uploadedAt: raw.uploaded_at,
    updatedAt: raw.updated_at,
    status: raw.status,
    result: raw.result,
    title: raw.file_name, // 임시로 파일명을 제목처럼 사용
  };
}

/** 문서 목록 조회: GET /documents/list */
export async function listDocuments(): Promise<DocumentSummary[]> {
  const res = await fetch(`${API_BASE_URL}/documents/list`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("문서 목록을 불러오지 못했어요.");
  }

  const data: RawDocumentDto[] = await res.json();
  return data.map(mapDocument);
}

/** 문서 상세 조회: GET /documents/{id} */
export async function getDocumentById(id: number): Promise<DocumentSummary> {
  const res = await fetch(`${API_BASE_URL}/documents/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("문서 정보를 불러오지 못했어요.");
  }

  const data: RawDocumentDto = await res.json();
  return mapDocument(data);
}

/** PDF 업로드: POST /documents/register */
export async function uploadDocument(file: File): Promise<DocumentSummary> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/documents/register`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("문서를 업로드하지 못했어요.");
  }

  const data: RawDocumentDto = await res.json();
  return mapDocument(data);
}

/**
 * PDF 분석 요청: POST /pdf-analyzer/analyze
 * - pdf_analyzer_router는 Form(...)을 쓰기 때문에 form-data로 보내야 함
 */
export async function analyzePdf(
  fileUrl: string,
  question: string,
): Promise<any> {
  const formData = new FormData();
  formData.append("file_url", fileUrl);
  formData.append(
    "question",
    question || "이 뉴스 기사의 핵심 내용과 주요 쟁점을 설명해줘.",
  );

  const res = await fetch(`${API_BASE_URL}/pdf-analyzer/analyze`, {
    method: "POST",
    credentials: "include", // 세션 쿠키 전달
    body: formData,
  });

  if (!res.ok) {
    throw new Error("PDF 분석에 실패했어요.");
  }

  return res.json();
}

/**
 * 분석 결과를 DB에 반영: PATCH /documents/{id}/result
 * - 백엔드에서 DocumentUseCase.update_result() 호출
 */
export async function updateDocumentResult(
  documentId: number,
  result: any,
  status: "completed" | "failed" = "completed",
): Promise<DocumentSummary> {
  const res = await fetch(
    `${API_BASE_URL}/documents/${documentId}/result`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ result, status }),
    },
  );

  if (!res.ok) {
    throw new Error("문서 결과를 저장하지 못했어요.");
  }

  const data: RawDocumentDto = await res.json();
  return mapDocument(data);
}
