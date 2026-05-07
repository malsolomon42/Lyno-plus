import { useState } from "react";
import { Heart, Rocket, Star, Coffee, Globe, Check, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useDonations } from "@/hooks/use-engagement";
import { format } from "date-fns";

const TIERS = [
  {
    id: "stargazer",
    label: "Stargazer",
    amount: 3,
    icon: Coffee,
    color: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
    iconColor: "text-amber-400",
    bg: "bg-amber-500/10",
    perk: "Buy the team a coffee",
    perks: ["Our eternal gratitude", "Name on the supporters wall"],
  },
  {
    id: "cosmonaut",
    label: "Cosmonaut",
    amount: 10,
    icon: Star,
    color: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    iconColor: "text-blue-400",
    bg: "bg-blue-500/10",
    perk: "Power our servers for a day",
    perks: ["Everything above", "Special supporter badge", "Early access to new features"],
    popular: true,
  },
  {
    id: "pilot",
    label: "Mission Pilot",
    amount: 25,
    icon: Rocket,
    color: "from-primary/20 to-primary/10 border-primary/30",
    iconColor: "text-primary",
    bg: "bg-primary/10",
    perk: "Fuel a week of coverage",
    perks: ["Everything above", "Name featured prominently", "Monthly mission brief newsletter"],
  },
  {
    id: "pioneer",
    label: "Space Pioneer",
    amount: 50,
    icon: Globe,
    color: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    iconColor: "text-purple-400",
    bg: "bg-purple-500/10",
    perk: "You're a legend among explorers",
    perks: ["Everything above", "Founding Pioneer status", "Direct line to the team"],
  },
];

export default function Support() {
  const { donations, totalRaised, progress, goal, donate } = useDonations();
  const [selected, setSelected] = useState(TIERS[1]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    donate(name.trim(), selected.label, selected.amount, message.trim());
    setStep("done");
  };

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-secondary/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Support the Mission
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              CosmosWire is free for everyone, forever. Your support keeps our servers
              running, our team caffeinated, and the cosmos covered.
            </p>

            {/* Goal Bar */}
            <div className="max-w-md mx-auto bg-card border border-white/10 rounded-2xl p-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">${totalRaised} raised</span>
                <span className="text-muted-foreground font-mono">goal: ${goal}/mo</span>
              </div>
              <div className="w-full h-3 bg-muted/40 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>{progress}% funded this month</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {donations.length} supporters
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl">
        <AnimatePresence mode="wait">
          {step === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 border border-primary/30 mb-6">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Thank you, {name}!</h2>
              <p className="text-muted-foreground text-lg mb-2">
                Your {selected.label} support of ${selected.amount} means the world to us.
              </p>
              <p className="text-muted-foreground mb-8">
                You're now part of the CosmosWire mission. Ad astra!
              </p>
              <Button
                onClick={() => { setStep("select"); setName(""); setMessage(""); }}
                variant="outline"
                className="rounded-full"
                data-testid="btn-donate-again"
              >
                Support Again
              </Button>
            </motion.div>
          ) : step === "confirm" ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-lg mx-auto"
            >
              <button
                onClick={() => setStep("select")}
                className="text-sm text-muted-foreground hover:text-primary mb-6 flex items-center gap-1 transition-colors"
                data-testid="btn-back-tiers"
              >
                ← Back to tiers
              </button>
              <div className={`rounded-2xl border bg-gradient-to-br ${selected.color} p-6 mb-6`}>
                <div className={`w-10 h-10 rounded-xl ${selected.bg} flex items-center justify-center mb-3`}>
                  <selected.icon className={`w-5 h-5 ${selected.iconColor}`} />
                </div>
                <h3 className="font-bold text-lg">{selected.label}</h3>
                <p className="text-3xl font-bold text-foreground mt-1">${selected.amount}</p>
                <ul className="mt-3 space-y-1.5">
                  {selected.perks.map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleDonate} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Your Name *</label>
                  <Input
                    placeholder="How should we credit you?"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    maxLength={50}
                    className="rounded-xl border-white/10 bg-card"
                    data-testid="input-donor-name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message (optional)</label>
                  <Textarea
                    placeholder="Leave a message for the team..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    maxLength={200}
                    rows={3}
                    className="rounded-xl border-white/10 bg-card resize-none"
                    data-testid="input-donor-message"
                  />
                </div>
                <div className="bg-muted/30 border border-white/5 rounded-xl p-4 text-xs text-muted-foreground leading-relaxed">
                  This is a simulated donation for demonstration purposes. No real payment is processed.
                  Your name and message will appear on the supporters wall.
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full gap-2"
                  disabled={!name.trim()}
                  data-testid="btn-confirm-donate"
                >
                  <Heart className="w-4 h-4" />
                  Complete ${selected.amount} Support
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Tier Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                {TIERS.map((tier, i) => (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => { setSelected(tier); setStep("confirm"); }}
                    className={`relative flex flex-col p-6 rounded-2xl border bg-gradient-to-br ${tier.color} cursor-pointer hover:scale-[1.02] transition-all duration-200`}
                    data-testid={`tier-${tier.id}`}
                  >
                    {tier.popular && (
                      <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3">
                        Most Popular
                      </Badge>
                    )}
                    <div className={`w-11 h-11 rounded-xl ${tier.bg} flex items-center justify-center mb-4`}>
                      <tier.icon className={`w-5 h-5 ${tier.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-0.5">{tier.label}</h3>
                    <p className="text-3xl font-bold mb-2">${tier.amount}</p>
                    <p className="text-xs text-muted-foreground mb-4 flex-1">{tier.perk}</p>
                    <div className={`text-xs font-semibold ${tier.iconColor} flex items-center gap-1`}>
                      Support Now <ArrowRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Supporters Wall */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">Supporters Wall</h2>
                  <span className="text-xs font-mono text-muted-foreground ml-auto">
                    {donations.length} pioneers
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {donations.map((d, i) => (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card border border-white/5 rounded-xl p-4"
                      data-testid={`supporter-${d.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                            {d.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{d.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{d.tier}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs border-white/10 font-mono">
                          ${d.amount}
                        </Badge>
                      </div>
                      {d.message && (
                        <p className="text-xs text-muted-foreground italic pl-10">&quot;{d.message}&quot;</p>
                      )}
                      <p className="text-xs text-muted-foreground/50 font-mono mt-2 pl-10">
                        {format(new Date(d.date), "MMM d, yyyy")}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
