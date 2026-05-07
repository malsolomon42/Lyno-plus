import { ArticleCard } from "./article-card";
import { Article } from "@/hooks/use-space-news";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleGridProps {
  articles?: Article[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export function ArticleGrid({ articles = [], isLoading, skeletonCount = 6 }: ArticleGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-loading">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="flex flex-col h-full bg-card rounded-xl overflow-hidden border border-white/5">
            <Skeleton className="w-full aspect-[16/9]" />
            <div className="p-5 flex flex-col gap-3">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-3/4 h-6" />
              <div className="flex-1" />
              <Skeleton className="w-full h-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground" data-testid="grid-empty">
        <p>No articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-articles">
      {articles.map((article, i) => (
        <ArticleCard key={article.id} article={article} index={i} />
      ))}
    </div>
  );
}
