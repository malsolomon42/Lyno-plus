import { Link } from "wouter";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useDonations } from "@/hooks/use-engagement";

export function SupportCta() {
  const { progress, totalRaised, goal } = useDonations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6 flex flex-col sm:flex-row items-center gap-5"
      data-testid="support-cta"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
        <Heart className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p className="font-semibold mb-0.5">Enjoying CosmosWire?</p>
        <p className="text-sm text-muted-foreground">
          We're {progress}% to our ${goal}/month goal — ${totalRaised} raised so far. Help keep this mission flying.
        </p>
        <div className="w-full h-1 bg-muted/40 rounded-full mt-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          />
        </div>
      </div>
      <Link href="/support">
        <Button size="sm" className="rounded-full gap-2 flex-shrink-0" data-testid="btn-cta-support">
          Support Us
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </motion.div>
  );
}
