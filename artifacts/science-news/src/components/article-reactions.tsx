import { useReactions, ReactionType } from "@/hooks/use-engagement";
import { motion, AnimatePresence } from "framer-motion";

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "rocket", emoji: "🚀", label: "Launching!" },
  { type: "heart", emoji: "❤️", label: "Love it" },
  { type: "mind", emoji: "🤯", label: "Mind-blown" },
  { type: "star", emoji: "⭐", label: "Brilliant" },
  { type: "telescope", emoji: "🔭", label: "Fascinating" },
];

interface ArticleReactionsProps {
  articleId: number;
}

export function ArticleReactions({ articleId }: ArticleReactionsProps) {
  const { reactions, userReaction, react } = useReactions(articleId);
  const total = Object.values(reactions).reduce((s, n) => s + n, 0);

  return (
    <div className="py-6 border-t border-white/10" data-testid="article-reactions">
      <p className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-widest">
        How did this make you feel?
      </p>
      <div className="flex flex-wrap gap-3">
        {REACTIONS.map(({ type, emoji, label }) => {
          const count = reactions[type];
          const active = userReaction === type;
          return (
            <motion.button
              key={type}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => react(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                active
                  ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_12px_-4px_hsl(var(--primary)/0.5)]"
                  : "border-white/10 bg-card hover:border-primary/30 hover:bg-primary/5 text-muted-foreground"
              }`}
              data-testid={`btn-reaction-${type}`}
            >
              <span className="text-base leading-none">{emoji}</span>
              <span>{label}</span>
              <AnimatePresence mode="wait">
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ opacity: 0, scale: 0.5, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="font-mono text-xs opacity-70"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      {total > 0 && (
        <p className="text-xs text-muted-foreground font-mono mt-3">
          {total} reader{total !== 1 ? "s" : ""} reacted to this article
        </p>
      )}
    </div>
  );
}
