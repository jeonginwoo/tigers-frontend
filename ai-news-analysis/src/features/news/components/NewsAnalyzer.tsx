"use client";

import { useId, useState } from "react";
import { ResultPanel } from "./ResultPanel";
import {
  uploadDocument,
  analyzePdf,
  updateDocumentResult,
  type DocumentSummary,
} from "@/features/documents/api/documentsApi";

type AnalysisResult = any; // ResultPanel이 기대하는 타입에 맞게 조정

export function NewsAnalyzer() {
  const fileInputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [document, setDocument] = useState<DocumentSummary | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
    setResult(null);
    setDocument(null);
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      setError("먼저 업로드할 뉴스 PDF 파일을 선택해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1) 업로드 + DB 기록
      const doc = await uploadDocument(file);
      setDocument(doc);

      // 2) PDF 분석 실행
      const analysis = await analyzePdf(
        doc.fileUrl,
        "이 PDF에 담긴 뉴스의 핵심 내용을 요약하고 감성/핵심 포인트를 분석해 줘.",
      );
      setResult(analysis);

      // 3) 결과를 DB에 반영 (선택적이지만 권장)
      const updated = await updateDocumentResult(doc.id, analysis, "completed");
      setDocument(updated);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "업로드 또는 분석 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (() => {
    if (error) return "분석 실패";
    if (loading) return "분석 중";
    if (result) return "분석 완료";
    if (document) return "업로드 완료, 분석 대기 중";
    return "대기 중";
  })();

  return (
    <div className="space-y-6">
      {/* 업로드 섹션 */}
      <div className="rounded-2xl border bg-card px-4 py-5 space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">뉴스 PDF 업로드</p>
          <p className="text-xs text-muted-foreground">
            한 개의 뉴스 기사 또는 리포트를 담은 PDF를 업로드하면 AI가 요약과 감성/핵심 포인트 분석을 진행합니다.
          </p>
        </div>

        <input
          id={fileInputId}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="sr-only"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label
            htmlFor={fileInputId}
            className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-muted-foreground/40 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary/5"
          >
            {file ? "다른 PDF 선택" : "PDF 파일 선택"}
          </label>
          <span className="text-xs text-muted-foreground">
            {file ? file.name : "선택된 파일 없음"}
          </span>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleUploadAndAnalyze}
          disabled={loading || !file}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-sm disabled:bg-muted"
        >
          {loading ? "업로드 및 분석 중..." : "PDF 업로드하고 분석 시작하기"}
        </button>

        <div className="text-[11px] text-muted-foreground">
          현재 상태: {statusLabel}
        </div>
      </div>

      {/* 결과 섹션 */}
      <div className="space-y-2">
        {result ? (
          <ResultPanel result={result as AnalysisResult} />
        ) : (
          <div className="rounded-2xl border border-dashed bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
            아직 분석 결과가 없어요.
            <br />
            뉴스 PDF를 업로드하고 분석을 실행하면 이 영역에 결과가 표시됩니다.
          </div>
        )}
      </div>
    </div>
  );
}
