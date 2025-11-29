// src/features/documents/components/DocumentDetailPanel.tsx
"use client";

import { useParams } from "next/navigation";
import { useDocumentDetail } from "../hooks/useDocuments";
import { DocumentStatusBadge } from "./DocumentStatusBadge";

export function DocumentDetailPanel() {
  const params = useParams<{ id: string }>();
  const { document, loading, error } = useDocumentDetail(params.id);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        문서 정보를 불러오는 중입니다...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        문서 정보를 불러오는 중 오류가 발생했습니다: {error}
      </p>
    );
  }

  if (!document) {
    return (
      <p className="text-sm text-muted-foreground">
        해당 문서를 찾을 수 없습니다.
      </p>
    );
  }

  const uploadedAtLabel = new Date(document.uploadedAt).toLocaleString(
    "ko-KR",
    { dateStyle: "medium", timeStyle: "short" },
  );

  return (
    <section className="space-y-4 rounded-3xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {document.title ?? document.fileName}
          </h2>
          <p className="text-xs text-muted-foreground">
            파일명: {document.fileName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            업로드: {uploadedAtLabel}
          </p>
        </div>
        <DocumentStatusBadge document={document} />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          분석 결과(JSON)
        </h3>
        <pre className="max-h-80 overflow-auto rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
          {JSON.stringify(document.result ?? {}, null, 2)}
        </pre>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <button className="rounded-xl border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted">
          원본 PDF 다운로드 (TODO)
        </button>
        <button className="rounded-xl border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted">
          분석 결과 PDF 다운로드 (TODO)
        </button>
      </div>
    </section>
  );
}
