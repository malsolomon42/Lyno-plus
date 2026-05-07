import { TechArticle } from "@/hooks/use-tech-news";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Clock, Heart, MessageSquare, ExternalLink } from "lucide-react";

const FALLBACKS: Record<string, string> = {
  "dev.to": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
  hackernews: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
};

const TAG_COLORS: Record<string, string> = {
  ai: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  machinelearning: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  computerscience: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  webdev: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  programming: "bg-green-500/15 text-green-400 border-green-500/20",
  science: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  javascript: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  python: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  rust: "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

function tagClass(tag: string) {
  return TAG_COLORS[tag.toLowerCase()] || "bg-muted/50 text-muted-foreground border-white/10";
}

interface TechCardProps {
  article: TechArticle;
  index?: number;
  compact?: boolean;
}

export function TechCard({ article, index = 0, compact = false }: TechCardProps) {
  const pubDate = new Date(article.published_at);
  const img = article.cover_image || FALLBACKS[article.source];

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.35) }}
      className="group flex flex-col bg-card border border-white/5 hover:border-primary/35 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_28px_-10px_hsl(var(--primary)/0.22)] h-full"
      data-testid={`tech-card-${article.id}`}
    >
      {!compact && (
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={img}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={e => { (e.target as HTMLImageElement).src = FALLBACKS[article.source]; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge
              className={`text-xs border font-mono ${
                article.source === "dev.to"
                  ? "bg-background/80 text-foreground border-white/15"
                  : "bg-orange-500/20 text-orange-400 border-orange-500/30"
              }`}
            >
              {article.source === "dev.to" ? "dev.to" : "HN"}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        {compact && (
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className={`text-xs border font-mono ${
                article.source === "dev.to"
                  ? "bg-muted/50 text-muted-foreground border-white/10"
                  : "bg-orange-500/10 text-orange-400 border-orange-500/20"
              }`}
            >
              {article.source === "dev.to" ? "dev.to" : "Hacker News"}
            </Badge>
            <ExternalLink className="w-3 h-3 text-muted-foreground/50 ml-auto" />
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-2.5">
          <span>{format(pubDate, "MMM d, yyyy")}</span>
          {article.reading_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.reading_time} min
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-2.5 flex-1">
          {article.title}
        </h3>

        {!compact && article.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${tagClass(tag)}`}
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-mono flex-shrink-0 ml-2">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {article.reactions}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {article.comments}
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
