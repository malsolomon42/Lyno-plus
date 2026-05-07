import { useRoute } from "wouter";
import { useArticles } from "@/hooks/use-space-news";
import { ArticleGrid } from "@/components/article-grid";
import { Rocket } from "lucide-react";

export default function Category() {
  const [, params] = useRoute("/category/:category");
  const category = params?.category || "";
  
  // Since the API doesn't have a direct category filter that perfectly matches our list,
  // we fetch recent articles and filter client-side, or we could use the search endpoint.
  // Using the search endpoint is better for category keywords to get more relevant results.
  // Re-using useArticles with search parameter via the search endpoint logic
  // Wait, useArticles doesn't support search natively in our hook, but useSearchArticles does.
  // However, for categories, maybe just standard search is fine. Let's use fetch directly here to simplify.
  
  // Let's create a custom query for this category
  const { data, isLoading } = useArticles({ limit: 100 }); // fetch more to filter client-side
  
  const filteredArticles = data?.results?.filter(article => {
    const term = category.toLowerCase();
    return article.title.toLowerCase().includes(term) || article.summary.toLowerCase().includes(term);
  }) || [];

  return (
    <div className="container mx-auto px-4 py-12 pb-20">
      <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Rocket className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight capitalize text-foreground">{category}</h1>
          <p className="text-muted-foreground mt-2">Latest signals matching this frequency</p>
        </div>
      </div>
      
      <ArticleGrid articles={filteredArticles} isLoading={isLoading} skeletonCount={9} />
    </div>
  );
}
