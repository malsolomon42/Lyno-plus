import { useTTS } from "@/hooks/use-tts";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ArticleReaderProps {
  title: string;
  source: string;
  summary: string;
}

export function ArticleReader({ title, source, summary }: ArticleReaderProps) {
  const { speak, pause, resume, stop, speaking, paused, supported } = useTTS();

  if (!supported) return null;

  const handleListen = () => {
    const text = `Article from ${source}. ${title}. ${summary}`;
    speak(text, { rate: 0.88 });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-t border-white/10" data-testid="article-reader">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Volume2 className="w-4 h-4 text-primary" />
        <span className="font-medium">Listen to Article</span>
      </div>

      <div className="flex items-center gap-2">
        {!speaking ? (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full gap-2 border-white/15 hover:border-primary/40 hover:text-primary text-sm"
            onClick={handleListen}
            data-testid="btn-read-aloud"
          >
            <Play className="w-3.5 h-3.5" />
            Play
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full gap-2 border-primary/30 text-primary bg-primary/5"
              onClick={paused ? resume : pause}
              data-testid="btn-pause-resume"
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {paused ? "Resume" : "Pause"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full text-muted-foreground hover:text-destructive"
              onClick={stop}
              data-testid="btn-stop-reading"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </Button>
          </>
        )}
      </div>

      <AnimatePresence>
        {speaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-1.5 ml-1"
          >
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div
                key={i}
                animate={paused ? { height: 4 } : { height: [4, 14, 4] }}
                transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                className={`w-0.5 bg-primary rounded-full ${paused ? "opacity-40" : ""}`}
              />
            ))}
            <span className="text-xs text-primary font-mono ml-1">
              {paused ? "Paused" : "Reading..."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!speaking && (
        <span className="text-xs text-muted-foreground">
          Press play to hear this article read aloud
        </span>
      )}

      <Button
        size="sm"
        variant="ghost"
        className="ml-auto rounded-full text-muted-foreground hover:text-foreground gap-1.5 text-xs"
        onClick={stop}
        data-testid="btn-mute-reader"
      >
        <VolumeX className="w-3.5 h-3.5" />
        Stop All Audio
      </Button>
    </div>
  );
}
