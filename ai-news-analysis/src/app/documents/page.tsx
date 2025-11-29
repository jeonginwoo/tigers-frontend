import Link from "next/link";
import { DocumentsListPanel } from "@/features/documents/components/DoucmentsListPanel";

export default function DocumentsPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            분석된 문서 목록
          </h2>
          <p className="text-xs text-muted-foreground">
            업로드된 PDF와 분석 결과를 한눈에 볼 수 있습니다.
          </p>
        </div>
        <Link
          href="/documents/upload"
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          새 문서 업로드
        </Link>
      </div>

      <DocumentsListPanel />
    </main>
  );
}
