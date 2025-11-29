// src/features/documents/components/DocumentStatusBadge.tsx
"use client";

import type { DocumentSummary } from "../types";

interface Props {
  document: DocumentSummary;
}

function getStatus(doc: DocumentSummary): "processing" | "done" {
  if (doc.status) return doc.status;
  return doc.result != null ? "done" : "processing";
}

export function DocumentStatusBadge({ document }: Props) {
  const status = getStatus(document);
  const label = status === "done" ? "분석 완료" : "분석 중";

  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
  const variant =
    status === "done"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-amber-50 text-amber-700";

  return <span className={`${base} ${variant}`}>{label}</span>;
}
