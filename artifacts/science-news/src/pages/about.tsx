import { motion } from "framer-motion";
import { Rocket, Globe, Zap, Users, Newspaper, Star, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "10,000+", label: "Articles Indexed", icon: Newspaper },
  { value: "50+", label: "News Sources", icon: Globe },
  { value: "24/7", label: "Live Updates", icon: Zap },
  { value: "Free", label: "Always & Forever", icon: Heart },
];

const PILLARS = [
  {
    icon: Globe,
    title: "Global Coverage",
    desc: "Aggregating news from NASA, ESA, SpaceX, Roscosmos, and dozens of leading space agencies and research institutions worldwide.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    desc: "Powered by the Spaceflight News API, our feed updates continuously so you never miss a breaking mission or discovery.",
  },
  {
    icon: Users,
    title: "Built for Explorers",
    desc: "Designed for curious minds — from amateur astronomers and students to seasoned researchers and space industry professionals.",
  },
];

export default function About() {
  return (
    <div className="pb-24">
      <section className="relative py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 border border-primary/30 mb-8">
              <Rocket className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              About lyno+
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your mission control for the universe. We aggregate the most important space
              and science news from the world's leading sources, delivered in real time.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 rounded-2xl p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 border border-primary/20">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-10 md:p-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-white/5 rounded-2xl p-10 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-5">
            <Star className="w-5 h-5 text-secondary fill-secondary/30" />
            <h2 className="text-lg font-semibold text-secondary tracking-wider uppercase font-mono text-sm">
              Our Mission
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Space exploration represents humanity's greatest collective endeavor. We believe
            that everyone — regardless of background, language, or location — deserves access
            to clear, accurate, and inspiring coverage of what our species is achieving beyond
            Earth's atmosphere.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            lyno+ exists to make that possible. Free, fast, and focused on what matters:
            the story of us reaching for the stars.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 text-center pt-8">
        <Link href="/">
          <Button size="lg" className="rounded-full gap-2" data-testid="link-go-to-news">
            <Rocket className="w-5 h-5" />
            Start Exploring
          </Button>
        </Link>
      </section>
    </div>
  );
}
