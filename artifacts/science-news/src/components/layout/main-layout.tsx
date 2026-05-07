import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
