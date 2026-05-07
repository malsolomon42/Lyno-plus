import { useArticles } from "@/hooks/use-space-news";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Link } from "wouter";

export function NewsTicker() {
  const { data } = useArticles({ limit: 10 });
  const articles = data?.results || [];

  if (articles.length === 0) return null;

  const items = [...articles, ...articles];

  return (
    <div className="bg-primary/10 border-b border-primary/20 overflow-hidden h-9 flex items-center" data-testid="news-ticker">
      <div className="flex-shrink-0 px-4 flex items-center gap-2 bg-primary/20 h-full border-r border-primary/30 z-10">
        <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">Live</span>
      </div>
      <div className="overflow-hidden flex-1 relative">
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          {items.map((article, i) => (
            <Link
              key={`${article.id}-${i}`}
              href={`/article/${article.id}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <span className="text-primary font-bold">•</span>
              {article.title}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
