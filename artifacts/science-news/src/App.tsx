import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { MainLayout } from "@/components/layout/main-layout";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import { useAuth } from "@workspace/replit-auth-web";

import Home from "@/pages/home";
import ArticleDetail from "@/pages/article";
import Search from "@/pages/search";
import Category from "@/pages/category";
import BookmarksPage from "@/pages/bookmarks";
import Explore from "@/pages/explore";
import About from "@/pages/about";
import Support from "@/pages/support";
import Launches from "@/pages/launches";
import Tech from "@/pages/tech";
import Watch from "@/pages/watch";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/article/:id" component={ArticleDetail} />
      <Route path="/search" component={Search} />
      <Route path="/category/:category" component={Category} />
      <Route path="/bookmarks" component={BookmarksPage} />
      <Route path="/explore" component={Explore} />
      <Route path="/about" component={About} />
      <Route path="/support" component={Support} />
      <Route path="/launches" component={Launches} />
      <Route path="/tech" component={Tech} />
      <Route path="/watch" component={Watch} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthGate() {
  const { isLoading, isAuthenticated } = useAuth();
  const [guest, setGuest] = useState(() => {
    return localStorage.getItem("lynoplus-guest") === "true";
  });

  const handleGuest = () => {
    localStorage.setItem("lynoplus-guest", "true");
    setGuest(true);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: "#050710" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"
            style={{ borderTopColor: "#3b82f6" }}
          />
          <p className="text-white/40 text-sm">Loading lyno+</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !guest) {
    return <LoginPage onGuest={handleGuest} />;
  }

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <MainLayout>
        <Router />
      </MainLayout>
    </WouterRouter>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="lynoplus-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthGate />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
