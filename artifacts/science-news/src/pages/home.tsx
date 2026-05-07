import { Link } from "wouter";
import { useArticles, useBlogs } from "@/hooks/use-space-news";
import { ArticleGrid } from "@/components/article-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { differenceInHours } from "date-fns";

export default function Home() {
  const { data: articlesData, isLoading: articlesLoading } = useArticles({ limit: 13 });
  const { data: blogsData, isLoading: blogsLoading } = useBlogs({ limit: 6 });

  const articles = articlesData?.results || [];
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end pb-16 pt-32">
        {featuredArticle ? (
          <>
            <div className="absolute inset-0 z-0">
              <img 
                src={featuredArticle.image_url} 
                alt={featuredArticle.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
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
                    <Badge variant="destructive" className="animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                      Breaking
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-background/50 backdrop-blur-md border-white/20">
                    Featured
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">
                    {featuredArticle.news_site}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]" data-testid="hero-title">
                  {featuredArticle.title}
                </h1>
                <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl line-clamp-3">
                  {featuredArticle.summary}
                </p>
                <Link href={`/article/${featuredArticle.id}`}>
                  <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group">
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

      {/* Latest News */}
      <section className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <Rocket className="w-6 h-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Latest Transmissions</h2>
        </div>
        <ArticleGrid articles={gridArticles} isLoading={articlesLoading} skeletonCount={12} />
      </section>

      {/* Latest Blogs */}
      <section className="container mx-auto px-4 bg-muted/30 py-16 rounded-3xl border border-white/5">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Mission Logs (Blogs)</h2>
        </div>
        <ArticleGrid articles={blogsData?.results} isLoading={blogsLoading} skeletonCount={6} />
      </section>
    </div>
  );
}
