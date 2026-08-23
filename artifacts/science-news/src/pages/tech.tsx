import { useState } from "react";
import { Cpu, Brain, Globe, FlaskConical, Code2, Lightbulb, Flame, ExternalLink, Activity, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TechCard } from "@/components/tech-card";
import { motion } from "framer-motion";
import { useDevToArticles, useHNStories, useTrendingTech, useGitHubTrending } from "@/hooks/use-tech-news";

const TABS = [
  { id: "trending", label: "Trending", icon: Flame, devTag: undefined, hnQuery: undefined },
  { id: "ai", label: "AI & ML", icon: Brain, devTag: "ai", hnQuery: "artificial intelligence" },
  { id: "cs", label: "Computer Science", icon: Cpu, devTag: "computerscience", hnQuery: "computer science" },
  { id: "web", label: "Web & Software", icon: Code2, devTag: "webdev", hnQuery: "software" },
  { id: "science", label: "Science", icon: FlaskConical, devTag: "science", hnQuery: "science research" },
  { id: "innovation", label: "Innovation", icon: Lightbulb, devTag: "programming", hnQuery: "startup innovation" },
] as const;

type TabId = typeof TABS[number]["id"];

function TabContent({ tabId }: { tabId: TabId }) {
  const tab = TABS.find(t => t.id === tabId)!;

  const trending = useTrendingTech();
  const devto = useDevToArticles(tab.devTag, 12);
  const hn = useHNStories(tab.hnQuery, 8);
  const github = useGitHubTrending(6);

  if (tabId === "trending") {
    const { articles, isLoading } = trending;
    if (isLoading) return <GridSkeleton />;
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "Live sources", value: "03", detail: "Dev.to · HN · GitHub", icon: Activity },
            { label: "Signal window", value: "7 days", detail: "Freshness weighted", icon: TrendingUp },
            { label: "Editorial lens", value: "Signal", detail: "Momentum over noise", icon: Sparkles },
          ].map(item => {
            const StatIcon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-card/70 p-4 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary"><StatIcon className="w-4 h-4" /></div>
                <div><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono">{item.label}</p><p className="font-semibold">{item.value} <span className="text-xs text-muted-foreground font-normal">{item.detail}</span></p></div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a, i) => <TechCard key={a.id} article={a} index={i} />)}
        </div>
      </div>
    );
  }

  const isLoading = devto.isLoading || hn.isLoading || github.isLoading;
  if (isLoading) return <GridSkeleton />;

  const combined = [...(devto.data || []), ...(hn.data || []), ...(github.data || [])];

  return (
    <div className="space-y-12">
      {/* Dev.to grid */}
      {devto.data && devto.data.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground border border-white/10 px-2 py-0.5 rounded-full">
              dev.to
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devto.data.map((a, i) => <TechCard key={a.id} article={a} index={i} />)}
          </div>
        </div>
      )}

      {/* HN section */}
      {hn.data && hn.data.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full bg-orange-500/5">
              Hacker News
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hn.data.map((a, i) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-4 bg-card border border-white/5 hover:border-orange-500/25 rounded-xl transition-all duration-200"
                data-testid={`hn-row-${a.id}`}
              >
                <span className="text-xl font-bold font-mono text-orange-400/40 w-6 flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-orange-400 transition-colors line-clamp-2 mb-1.5">
                    {a.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span>by {a.author}</span>
                    <span>▲ {a.reactions}</span>
                    <span>💬 {a.comments}</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-orange-400/70 flex-shrink-0 mt-1 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {github.data && github.data.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full bg-cyan-500/5">
              GitHub rising
            </span>
            <span className="text-xs text-muted-foreground">new repositories with momentum</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {github.data.map((a, i) => (
              <TechCard key={a.id} article={a} index={i} compact />
            ))}
          </div>
        </div>
      )}

      {combined.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p>No articles found for this category.</p>
        </div>
      )}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-card border border-white/5 rounded-xl overflow-hidden">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Tech() {
  const [activeTab, setActiveTab] = useState<TabId>("trending");
  const tab = TABS.find(t => t.id === activeTab)!;
  const Icon = tab.icon;

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/8 via-blue-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
                Tech & Innovation
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Science, Tech &<br className="hidden md:block" /> Innovation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              The latest from computer science, artificial intelligence, web development,
              scientific research, and the innovations reshaping our world — alongside space news.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Bar */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {TABS.map(t => {
              const TIcon = t.icon;
              const active = activeTab === t.id;
              return (
                <Button
                  key={t.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-shrink-0 rounded-full gap-2 text-sm transition-all ${
                    active
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  data-testid={`tab-tech-${t.id}`}
                >
                  <TIcon className="w-3.5 h-3.5" />
                  {t.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-10">
        <div className="flex items-center gap-3 mb-8">
          <Icon className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">{tab.label}</h2>
          <span className="text-xs font-mono text-muted-foreground border border-white/10 px-2 py-0.5 rounded-full ml-1">
            {tab.id === "trending" ? "dev.to + Hacker News" : "dev.to · Hacker News"}
          </span>
        </div>
        <TabContent tabId={activeTab} />
      </div>
    </div>
  );
}
