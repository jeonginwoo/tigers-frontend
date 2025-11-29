"use client";

import { useState } from "react";
import type { AnalyzeNewsResponse, Sentiment } from "../types";

type ResultPayload =
  | AnalyzeNewsResponse
  | {
      parsed_text?: string;
      summary?: string;
      answer?: string;
      analysis?: {
        sentiment?: Sentiment;
        key_actors?: string[];
        key_issues?: string[];
      };
    };

function getSentimentLabel(sentiment?: Sentiment) {
  switch (sentiment) {
    case "positive":
      return "긍정적";
    case "neutral":
      return "중립적";
    case "negative":
      return "부정적";
    default:
      return "-";
  }
}

const SENTIMENT_CLASS: Record<Sentiment | "neutral", string> = {
  positive: "border-emerald-200 bg-emerald-50 text-emerald-600",
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
  negative: "border-rose-200 bg-rose-50 text-rose-600",
};

interface ResultPanelProps {
  result: ResultPayload | null;
}

export function ResultPanel({ result }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const sentiment =
    (result as AnalyzeNewsResponse)?.sentiment ??
    (result as any)?.analysis?.sentiment ??
    "neutral";

  const keyPoints =
    (result as AnalyzeNewsResponse)?.key_points ??
    (result as any)?.analysis?.key_issues ??
    [];

  const handleCopy = async () => {
    if (!result) return;
    try {
      const summaryText = [
        typeof sentiment === "string" ? `Sentiment: ${sentiment}` : "",
        ...(Array.isArray(keyPoints) ? keyPoints : []),
      ]
        .filter(Boolean)
        .join("\n");
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b pb-4">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path d="M12 14v7M8 5v6m8-4v10M4 9v12m16-16v16" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">분석 결과</p>
            <p className="text-sm text-muted-foreground">
              AI가 추출한 핵심 정보를 한눈에 확인하세요
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!result}
          className="rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copied ? "복사 완료" : "결과 복사"}
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">감정 분석</p>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${SENTIMENT_CLASS[sentiment]}`}
          >
            {getSentimentLabel(sentiment)}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            핵심 포인트
          </p>
          {keyPoints.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-input bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
              아직 분석 결과가 없습니다. 기사를 입력한 뒤 AI 분석을 실행해
              보세요.
            </div>
          ) : (
            <ol className="space-y-3">
              {keyPoints.map((point, idx) => (
                <li
                  key={`${point}-${idx}`}
                  className="flex gap-3 rounded-2xl border bg-muted/40 px-4 py-3 text-sm text-foreground"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{point}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
