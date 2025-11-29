import Link from "next/link";
import { UploadDocumentForm } from "@/features/documents/components/UploadDocumentForm";

export default function UploadPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-8 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            PDF 문서 업로드
          </h2>
          <p className="text-xs text-muted-foreground">
            뉴스/리포트 PDF를 업로드하면 AI가 자동으로 분석합니다.
          </p>
        </div>
        <Link
          href="/documents"
          className="text-xs text-primary hover:underline"
        >
          목록으로 돌아가기
        </Link>
      </div>

      <UploadDocumentForm />
    </main>
  );
}
