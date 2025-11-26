import { AccountPanel } from "@/features/auth/components/AccountPanel";
import { NewsAnalyzer } from "@/features/news/components/NewsAnalyzer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-10">
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/20 text-primary">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                금융 기사를 AI로 분석하고 핵심 인사이트를 추출합니다
              </p>
              <h1 className="text-2xl font-semibold text-foreground">
                AI 뉴스 분석
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Google OAuth로 로그인하면 세션 기반으로 프로필을 불러오고 닉네임을 관리할 수 있습니다.
              </p>
            </div>
          </div>
        </section>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <NewsAnalyzer />
          <AccountPanel />
        </div>
      </main>
    </div>
  );
}
