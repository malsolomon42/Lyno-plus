import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            size="icon"
            className="rounded-full h-12 w-12 bg-background/80 hover:bg-primary/20 border border-primary/30 shadow-lg shadow-primary/10 backdrop-blur-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="btn-back-to-top"
          >
            <ArrowUp className="w-5 h-5 text-primary" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
