import { useState } from "react";
import { Link } from "wouter";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useDonations } from "@/hooks/use-engagement";

export function SupportWidget() {
  const [dismissed, setDismissed] = useState(false);
  const { progress } = useDonations();

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80, scale: 0.9 }}
        transition={{ delay: 3, duration: 0.4 }}
        className="fixed bottom-8 left-6 z-40 max-w-[260px]"
        data-testid="support-widget"
      >
        <div className="relative bg-card border border-primary/30 rounded-2xl p-4 shadow-xl shadow-primary/10 backdrop-blur-sm">
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full text-muted-foreground hover:text-foreground flex items-center justify-center hover:bg-muted/50 transition-colors"
            data-testid="btn-dismiss-support"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold">Support lyno+</span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            We're {progress}% to our monthly goal. Help us keep the lights on in deep space.
          </p>

          <div className="w-full h-1.5 bg-muted/50 rounded-full mb-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 3.5 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>

          <Link href="/support">
            <Button
              size="sm"
              className="w-full rounded-full text-xs h-8 gap-1.5"
              data-testid="btn-widget-donate"
            >
              <Heart className="w-3 h-3" />
              Support Us
            </Button>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
