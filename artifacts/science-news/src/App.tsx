import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { MainLayout } from "@/components/layout/main-layout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import ArticleDetail from "@/pages/article";
import Search from "@/pages/search";
import Category from "@/pages/category";
import BookmarksPage from "@/pages/bookmarks";
import Explore from "@/pages/explore";
import About from "@/pages/about";
import Support from "@/pages/support";
import Launches from "@/pages/launches";

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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="lynoplus-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <MainLayout>
              <Router />
            </MainLayout>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
