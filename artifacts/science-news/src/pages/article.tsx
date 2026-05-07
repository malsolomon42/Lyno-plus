import { useRoute, Link } from "wouter";
import { useArticle, useRelatedArticles } from "@/hooks/use-space-news";
import { format, differenceInHours } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, Calendar, Newspaper, Rocket, Bookmark, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ReadingProgress } from "@/components/reading-progress";
import { ShareButtons } from "@/components/share-buttons";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { ArticleCard } from "@/components/article-card";

function getReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function ArticleDetail() {
  const [, params] = useRoute("/article/:id");
  const id = params?.id || "";

  const { data: article, isLoading, error } = useArticle(id);
  const { data: relatedData } = useRelatedArticles(
    article?.news_site || "",
    article?.id || 0
  );
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = article ? isBookmarked(article.id) : false;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl" data-testid="article-loading">
        <Skeleton className="w-48 h-6 mb-8" />
        <Skeleton className="w-full h-10 mb-4" />
        <Skeleton className="w-80 h-6 mb-8" />
        <Skeleton className="w-full aspect-video rounded-2xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-3/4 h-6" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center" data-testid="article-error">
        <h2 className="text-2xl font-bold mb-4">Transmission Lost</h2>
        <p className="text-muted-foreground mb-8">We couldn't retrieve this article.</p>
        <Link href="/">
          <Button variant="outline" className="rounded-full">Return to Base</Button>
        </Link>
      </div>
    );
  }

  const publishedDate = new Date(article.published_at);
  const isBreaking = differenceInHours(new Date(), publishedDate) < 24;
  const readingTime = getReadingTime(article.summary);
  const relatedArticles = relatedData?.results || [];

  return (
    <>
      <ReadingProgress />
      <article className="pb-20" data-testid={`article-detail-${article.id}`}>
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground gap-2" data-testid="btn-back">
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap gap-3 items-center">
              {isBreaking && (
                <Badge variant="destructive" className="animate-pulse">Breaking</Badge>
              )}
              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm bg-primary/20 text-primary hover:bg-primary/30 border-none"
              >
                <Newspaper className="w-3 h-3 mr-2" />
                {article.news_site}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground font-mono gap-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(publishedDate, "MMMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {readingTime} min read
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`ml-auto rounded-full gap-2 border border-white/10 ${
                  bookmarked ? "text-primary border-primary/30 bg-primary/10" : "text-muted-foreground"
                }`}
                onClick={() => toggleBookmark(article)}
                data-testid="btn-bookmark-article"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-primary" : ""}`} />
                {bookmarked ? "Saved" : "Save"}
              </Button>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.15]">
              {article.title}
            </h1>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl my-10">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop";
                }}
              />
            </div>

            <div className="prose prose-invert max-w-none prose-lg">
              <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-8">
                {article.summary}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-8 border-t border-white/10">
              <Button
                asChild
                size="lg"
                className="rounded-full"
                data-testid="btn-read-full"
              >
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article at Source
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <ShareButtons
                title={article.title}
                url={typeof window !== "undefined" ? window.location.href : article.url}
              />
            </div>

            {(article.launches.length > 0 || article.events.length > 0) && (
              <div className="bg-muted/30 border border-white/5 rounded-xl p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <Rocket className="w-5 h-5 text-primary" />
                  Related Missions & Events
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.launches.map((launch) => (
                    <Badge key={launch.id} variant="outline" className="bg-background">
                      Launch: {launch.provider}
                    </Badge>
                  ))}
                  {article.events.map((event) => (
                    <Badge key={event.id} variant="outline" className="bg-background">
                      Event: {event.provider}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {relatedArticles.length > 0 && (
          <div className="container mx-auto px-4 max-w-5xl mt-16 pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              More from {article.news_site}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related, i) => (
                <ArticleCard key={related.id} article={related} index={i} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
