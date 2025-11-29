// src/features/documents/components/DocumentsListPanel.tsx
"use client";

import { useDocumentsList } from "../hooks/useDocuments";
import { DocumentsList } from "./DocumentsList";

export function DocumentsListPanel() {
  const { documents, loading, error } = useDocumentsList();
  return (
    <DocumentsList documents={documents} loading={loading} error={error} />
  );
}
