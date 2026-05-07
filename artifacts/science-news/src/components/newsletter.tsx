import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Rocket, Check } from "lucide-react";
import { motion } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const subscribers = JSON.parse(
        localStorage.getItem("cosmoswire-subscribers") || "[]"
      );
      subscribers.push({ email, date: new Date().toISOString() });
      localStorage.setItem("cosmoswire-subscribers", JSON.stringify(subscribers));
    } catch {
    }
    setSubmitted(true);
  };

  return (
    <section className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-10 md:p-16 text-center"
      >
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-6">
            {submitted ? (
              <Check className="w-8 h-8 text-primary" />
            ) : (
              <Mail className="w-8 h-8 text-primary" />
            )}
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3"
            >
              <h2 className="text-3xl font-bold">You're on the manifest.</h2>
              <p className="text-muted-foreground text-lg">
                Mission control will send your first transmission shortly.
              </p>
            </motion.div>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Join the Mission</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Get the most important space discoveries, rocket launches, and cosmic breakthroughs delivered to your inbox.
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-full bg-background/50 border-white/20 focus-visible:ring-primary/50 flex-1"
                  data-testid="input-newsletter-email"
                />
                <Button
                  type="submit"
                  className="h-12 px-6 rounded-full gap-2 flex-shrink-0"
                  data-testid="btn-newsletter-submit"
                >
                  <Rocket className="w-4 h-4" />
                  Launch
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                No spam. Unsubscribe anytime. Only signals worth receiving.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
