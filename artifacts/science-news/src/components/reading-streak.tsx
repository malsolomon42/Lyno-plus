import { useStreak } from "@/hooks/use-engagement";
import { Flame } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ReadingStreak() {
  const streak = useStreak();
  if (streak.current < 1) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 cursor-default"
          data-testid="reading-streak"
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-bold font-mono text-orange-400">
            {streak.current}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        <p className="font-semibold">{streak.current}-day reading streak!</p>
        {streak.longest > streak.current && (
          <p className="text-muted-foreground">Best: {streak.longest} days</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
