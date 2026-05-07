import { Link } from "wouter";
import { motion } from "framer-motion";
import { format, differenceInHours } from "date-fns";
import { Article } from "@/hooks/use-space-news";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const publishedDate = new Date(article.published_at);
  const isBreaking = differenceInHours(new Date(), publishedDate) < 24;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col h-full bg-card border border-white/5 hover:border-primary/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]"
    >
      <Link href={`/article/${article.id}`} className="absolute inset-0 z-10" data-testid={`link-article-${article.id}`}>
        <span className="sr-only">Read {article.title}</span>
      </Link>
      
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <img 
          src={article.image_url} 
          alt={article.title}
          loading="lazy"
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {isBreaking && (
            <Badge variant="destructive" className="font-mono uppercase tracking-wider text-xs px-2 py-0.5 shadow-lg animate-pulse" data-testid={`badge-breaking-${article.id}`}>
              Breaking
            </Badge>
          )}
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90" data-testid={`badge-source-${article.id}`}>
            {article.news_site}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center text-xs text-muted-foreground font-mono mb-3" data-testid={`text-date-${article.id}`}>
          {format(publishedDate, "MMMM d, yyyy")}
        </div>
        <h3 className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-3" data-testid={`text-title-${article.id}`}>
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 flex-1" data-testid={`text-summary-${article.id}`}>
          {article.summary}
        </p>
      </div>
    </motion.div>
  );
}
