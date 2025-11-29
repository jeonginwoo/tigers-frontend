// src/features/documents/components/DocumentsList.tsx
"use client";

import Link from "next/link";
import type { DocumentSummary } from "../types";
import { DocumentStatusBadge } from "./DocumentStatusBadge";

interface Props {
  documents: DocumentSummary[];
  loading?: boolean;
  error?: string | null;
}

export function DocumentsList({ documents, loading, error }: Props) {
  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        문서 목록을 불러오는 중입니다...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        문서 목록을 불러오는 중 오류가 발생했습니다: {error}
      </p>
    );
  }

  if (!documents.length) {
    return (
      <p className="text-sm text-muted-foreground">
        아직 업로드된 문서가 없습니다. 먼저 PDF를 업로드해 주세요.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Link
          key={doc.id}
          href={`/documents/${doc.id}`}
          className="block rounded-2xl border bg-card p-4 hover:bg-muted/50"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {doc.title ?? doc.fileName}
              </p>
              <p className="text-xs text-muted-foreground">
                파일명: {doc.fileName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                업로드:{" "}
                {new Date(doc.uploadedAt).toLocaleString("ko-KR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <DocumentStatusBadge document={doc} />
          </div>
        </Link>
      ))}
    </div>
  );
}
