// src/features/documents/hooks/useDocuments.ts
"use client";

import { useEffect, useState } from "react";
import type { DocumentSummary } from "../types";
import { getDocumentById, listDocuments } from "../api/documentsApi";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_DOCUMENTS_MOCK === "true";

const MOCK_DOCUMENTS: DocumentSummary[] = [
  // 필요하면 개발용 목업 (간단하게 예시 하나)
  {
    id: 1,
    fileName: "sample.pdf",
    s3Key: "documents/sample.pdf",
    uploaderId: 1,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    result: null,
    title: "샘플 문서 (MOCK)",
    status: "processing",
  },
];

export function useDocumentsList() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchDocuments() {
      setLoading(true);
      setError(null);

      try {
        const data = USE_MOCK ? MOCK_DOCUMENTS : await listDocuments();
        if (!mounted) return;
        setDocuments(data);
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "문서 목록을 불러오는 중 문제가 발생했습니다.",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void fetchDocuments();

    return () => {
      mounted = false;
    };
  }, []);

  return { documents, loading, error };
}

export function useDocumentDetail(id: string | number | undefined) {
  const [document, setDocument] = useState<DocumentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id == null) return;

    let mounted = true;

    async function fetchDetail() {
      setLoading(true);
      setError(null);

      try {
        const numericId: number =
          typeof id === "string" ? Number(id) : (id as number);

        const data = USE_MOCK
          ? MOCK_DOCUMENTS.find((d) => d.id === numericId) ?? null
          : await getDocumentById(numericId);

        if (!mounted) return;

        if (!data) {
          setError("해당 문서를 찾을 수 없습니다.");
          setDocument(null);
        } else {
          setDocument(data);
        }
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "문서 정보를 불러오는 중 문제가 발생했습니다.",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void fetchDetail();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { document, loading, error };
}
