import { usePoll } from "@/hooks/use-engagement";
import { motion } from "framer-motion";
import { Vote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const OPTIONS = [
  "Mars Missions",
  "Moon Landing",
  "James Webb Discoveries",
  "Space Tourism",
  "Asteroid Mining",
];

export function PollWidget() {
  const { vote, votes, castVote } = usePoll();
  const total = Object.values(votes).reduce((s, n) => s + n, 0);

  return (
    <section className="container mx-auto px-4">
      <div className="rounded-3xl border border-accent/20 bg-accent/5 p-8 md:p-10" data-testid="poll-widget">
        <div className="flex items-center gap-3 mb-2">
          <Vote className="w-5 h-5 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-accent font-mono">
            Community Poll
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          What space story excites you most in 2026?
        </h2>

        <div className="space-y-3">
          {OPTIONS.map(option => {
            const count = votes[option] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isVoted = vote === option;

            return (
              <div key={option} className="relative" data-testid={`poll-option-${option.toLowerCase().replace(/\s+/g, "-")}`}>
                {vote ? (
                  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-card px-4 py-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                      className={`absolute inset-y-0 left-0 rounded-xl ${isVoted ? "bg-accent/20" : "bg-white/5"}`}
                    />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isVoted && <Check className="w-4 h-4 text-accent flex-shrink-0" />}
                        <span className={`text-sm font-medium ${isVoted ? "text-accent" : "text-foreground"}`}>
                          {option}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl border-white/10 hover:border-accent/40 hover:bg-accent/10 hover:text-accent text-sm h-11"
                    onClick={() => castVote(option)}
                    data-testid={`btn-vote-${option.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {option}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground font-mono mt-4">
          {total.toLocaleString()} votes cast
          {vote && <span className="ml-2 text-accent">· Your vote: {vote}</span>}
        </p>
      </div>
    </section>
  );
}
