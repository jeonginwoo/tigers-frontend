// src/features/documents/components/UploadDocumentForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadDocument } from "../api/documentsApi";

export function UploadDocumentForm() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!file) {
      setMessage("업로드할 PDF 파일을 선택해 주세요.");
      return;
    }

    setUploading(true);
    try {
      const created = await uploadDocument(file);
      setMessage("문서 업로드 및 등록이 완료되었습니다.");
      router.push(`/documents/${created.id}`);
    } catch (err) {
      console.error(err);
      setMessage(
        err instanceof Error
          ? err.message
          : "업로드 중 오류가 발생했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">
            분석할 PDF 파일
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-xs text-muted-foreground file:mr-4 file:rounded-2xl file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "업로드 중..." : "업로드 및 분석 시작"}
        </button>
      </form>

      {message && (
        <p className="mt-4 rounded-2xl bg-muted/50 px-4 py-3 text-xs text-foreground">
          {message}
        </p>
      )}
    </section>
  );
}
