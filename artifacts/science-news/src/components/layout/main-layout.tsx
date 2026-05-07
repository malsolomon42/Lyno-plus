import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { NewsTicker } from "@/components/news-ticker";
import { BackToTop } from "@/components/back-to-top";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans selection:bg-primary/30 selection:text-primary-foreground">
      <NewsTicker />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
