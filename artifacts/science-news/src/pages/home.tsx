import { useState } from "react";
import { Link } from "wouter";
import { useArticles, useBlogs } from "@/hooks/use-space-news";
import { ArticleGrid } from "@/components/article-grid";
import { Newsletter } from "@/components/newsletter";
import { SpaceFacts } from "@/components/space-facts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight, ChevronDown, Telescope, Satellite, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { differenceInHours } from "date-fns";

const CATEGORIES_QUICK = [
  { name: "Launches", icon: Rocket, href: "/category/Launches" },
  { name: "Deep Space", icon: Telescope, href: "/category/Deep Space" },
  { name: "Satellites", icon: Satellite, href: "/category/Satellites" },
  { name: "Explore All", icon: Globe, href: "/explore" },
];

const PAGE_SIZE = 12;

export default function Home() {
  const [page, setPage] = useState(0);
  const [allArticles, setAllArticles] = useState<import("@/hooks/use-space-news").Article[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const { data: articlesData, isLoading: articlesLoading } = useArticles({
    limit: PAGE_SIZE + 1,
    offset: 0,
  });
  const { data: blogsData, isLoading: blogsLoading } = useBlogs({ limit: 6 });
  const { data: moreData, isLoading: moreLoading } = useArticles({
    limit: PAGE_SIZE,
    offset: PAGE_SIZE + 1 + page * PAGE_SIZE,
  });

  const firstPageArticles = articlesData?.results || [];
  const featuredArticle = firstPageArticles.length > 0 ? firstPageArticles[0] : null;
  const gridArticles = firstPageArticles.length > 1 ? firstPageArticles.slice(1) : [];

  const handleLoadMore = () => {
    const newItems = moreData?.results || [];
    setAllArticles(prev => {
      const ids = new Set(prev.map(a => a.id));
      return [...prev, ...newItems.filter(a => !ids.has(a.id))];
    });
    setPage(p => p + 1);
    setHasLoaded(true);
  };

  const allGridArticles = [...gridArticles, ...allArticles];
  const hasMore = moreData?.next !== null || !hasLoaded;

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-end pb-16 pt-32">
        {featuredArticle ? (
          <>
            <div className="absolute inset-0 z-0">
              <img
                src={featuredArticle.image_url}
                alt={featuredArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-background/20" />
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  {differenceInHours(new Date(), new Date(featuredArticle.published_at)) < 24 && (
                    <Badge
                      variant="destructive"
                      className="animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    >
                      Breaking
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="bg-background/50 backdrop-blur-md border-white/20"
                  >
                    Featured
                  </Badge>
                  <span className="text-sm font-mono text-white/60">
                    {featuredArticle.news_site}
                  </span>
                </div>
                <h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                  data-testid="hero-title"
                >
                  {featuredArticle.title}
                </h1>
                <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl line-clamp-3">
                  {featuredArticle.summary}
                </p>
                <Link href={`/article/${featuredArticle.id}`}>
                  <Button
                    size="lg"
                    className="rounded-full font-semibold group"
                    data-testid="btn-hero-read"
                  >
                    Read Full Story
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-muted/20 animate-pulse" />
        )}
      </section>

      {/* Quick Category Chips */}
      <section className="container mx-auto px-4 -mt-6">
        <div className="flex flex-wrap gap-3" data-testid="quick-categories">
          {CATEGORIES_QUICK.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={cat.href}>
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm gap-2 border-white/10 bg-card hover:border-primary/50 hover:text-primary cursor-pointer transition-all"
                  data-testid={`chip-cat-${cat.name.toLowerCase().replace(" ", "-")}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </Badge>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest News */}
      <section className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <Rocket className="w-6 h-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Latest Transmissions
          </h2>
          <span className="ml-auto text-xs font-mono text-muted-foreground">
            {articlesData?.count ? `${articlesData.count.toLocaleString()} total` : ""}
          </span>
        </div>
        <ArticleGrid
          articles={allGridArticles}
          isLoading={articlesLoading}
          skeletonCount={12}
        />

        {!articlesLoading && hasMore && (
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-white/20 gap-2 min-w-[180px]"
              onClick={handleLoadMore}
              disabled={moreLoading}
              data-testid="btn-load-more"
            >
              {moreLoading ? (
                <>Loading...</>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Load More Articles
                </>
              )}
            </Button>
          </div>
        )}
      </section>

      {/* Space Facts Widget */}
      <SpaceFacts />

      {/* Newsletter */}
      <Newsletter />

      {/* Mission Logs */}
      <section className="container mx-auto px-4 bg-muted/20 py-14 rounded-3xl border border-white/5">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Mission Logs
          </h2>
          <span className="text-xs text-muted-foreground font-mono">Community Blogs</span>
        </div>
        <ArticleGrid articles={blogsData?.results} isLoading={blogsLoading} skeletonCount={6} />
      </section>
    </div>
  );
}
