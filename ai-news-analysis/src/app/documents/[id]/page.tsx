import Link from "next/link";
import { DocumentDetailPanel } from "@/features/documents/components/DocumentDetailPanel";

export default function DocumentDetailPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-4">
      <Link
        href="/documents"
        className="text-xs text-primary hover:underline"
      >
        ← 목록으로 돌아가기
      </Link>

      <DocumentDetailPanel />
    </main>
  );
}
