import { useState, useEffect } from "react";
import { useSearchArticles } from "@/hooks/use-space-news";
import { ArticleGrid } from "@/components/article-grid";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

// Hook for debouncing value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  
  const { data, isLoading } = useSearchArticles(debouncedQuery, { limit: 20 });
  const articles = data?.results || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Deep Space Radar</h1>
        <p className="text-muted-foreground mb-8">Scan the cosmos for news, missions, and discoveries.</p>
        
        <div className="relative relative-group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search for 'Artemis', 'SpaceX', 'Black Hole'..."
            className="pl-12 h-14 text-lg rounded-full bg-background border-white/20 focus-visible:ring-primary/50 shadow-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="input-search"
          />
        </div>
      </div>

      {debouncedQuery.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground font-mono">
            <span>Results for "{debouncedQuery}"</span>
            <span>{data?.count || 0} signals detected</span>
          </div>
          <ArticleGrid articles={articles} isLoading={isLoading} skeletonCount={6} />
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground flex flex-col items-center">
          <SearchIcon className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-lg">Radar is active. Awaiting your signal query.</p>
        </div>
      )}
    </div>
  );
}
