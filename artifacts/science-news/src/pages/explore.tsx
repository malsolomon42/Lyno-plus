import { Link } from "wouter";
import { motion } from "framer-motion";
import { Rocket, Globe, Moon, Star, Cpu, Telescope, Satellite, Flame, Atom, Brain, Code2, FlaskConical, Lightbulb, Newspaper } from "lucide-react";
import { useArticles } from "@/hooks/use-space-news";
import { differenceInHours } from "date-fns";

const SPACE_CATEGORIES = [
  {
    name: "Launches",
    description: "Rocket missions, countdowns, and liftoff reports",
    href: "/category/Launches",
    icon: Rocket,
    gradient: "from-orange-500/20 to-red-600/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    keywords: ["launch", "rocket", "liftoff", "mission", "falcon", "starship"],
  },
  {
    name: "Mars",
    description: "The red planet — rovers, missions, and future colonies",
    href: "/category/Mars",
    icon: Globe,
    gradient: "from-red-500/20 to-rose-600/10",
    border: "border-red-500/20",
    text: "text-red-400",
    bg: "bg-red-500/10",
    keywords: ["mars", "martian", "perseverance", "ingenuity", "curiosity"],
  },
  {
    name: "Moon",
    description: "Lunar exploration, Artemis, and Gateway station",
    href: "/category/Moon",
    icon: Moon,
    gradient: "from-slate-400/20 to-slate-600/10",
    border: "border-slate-400/20",
    text: "text-slate-300",
    bg: "bg-slate-400/10",
    keywords: ["moon", "lunar", "artemis", "moonshot", "gateway"],
  },
  {
    name: "Deep Space",
    description: "Galaxies, black holes, and the edges of the universe",
    href: "/category/Deep Space",
    icon: Telescope,
    gradient: "from-purple-500/20 to-indigo-600/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    keywords: ["galaxy", "nebula", "black hole", "telescope", "dark matter", "james webb"],
  },
  {
    name: "Satellites",
    description: "Orbital infrastructure, Starlink, and the ISS",
    href: "/category/Satellites",
    icon: Satellite,
    gradient: "from-blue-500/20 to-sky-600/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    keywords: ["satellite", "starlink", "ISS", "orbit", "station", "crewed"],
  },
  {
    name: "Astronomy",
    description: "Stars, planets, comets, and astronomical discoveries",
    href: "/category/Astronomy",
    icon: Star,
    gradient: "from-yellow-500/20 to-amber-600/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
    keywords: ["star", "astronomy", "planet", "comet", "asteroid", "exoplanet"],
  },
  {
    name: "Science",
    description: "Physics, biology, and fundamental research in space",
    href: "/category/Science",
    icon: Atom,
    gradient: "from-emerald-500/20 to-green-600/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    keywords: ["science", "research", "physics", "biology", "experiment", "study"],
  },
  {
    name: "Breaking",
    description: "The most recent signals from the past 24 hours",
    href: "/category/Breaking",
    icon: Flame,
    gradient: "from-rose-500/20 to-pink-600/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    keywords: [],
  },
];

const TECH_CATEGORIES = [
  {
    name: "AI & Machine Learning",
    description: "Neural networks, large language models, and AI breakthroughs",
    href: "/tech?tab=ai",
    icon: Brain,
    gradient: "from-violet-500/20 to-purple-600/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    badge: "dev.to · HN",
  },
  {
    name: "Computer Science",
    description: "Algorithms, systems, programming languages, and CS research",
    href: "/tech?tab=cs",
    icon: Cpu,
    gradient: "from-cyan-500/20 to-blue-600/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    badge: "dev.to · HN",
  },
  {
    name: "Web & Software",
    description: "Frameworks, cloud, DevOps, and software engineering",
    href: "/tech?tab=web",
    icon: Code2,
    gradient: "from-green-500/20 to-teal-600/10",
    border: "border-green-500/20",
    text: "text-green-400",
    bg: "bg-green-500/10",
    badge: "dev.to",
  },
  {
    name: "Science & Research",
    description: "Peer-reviewed discoveries in biology, chemistry, and physics",
    href: "/tech?tab=science",
    icon: FlaskConical,
    gradient: "from-teal-500/20 to-emerald-600/10",
    border: "border-teal-500/20",
    text: "text-teal-400",
    bg: "bg-teal-500/10",
    badge: "dev.to",
  },
  {
    name: "Innovation",
    description: "Startups, breakthroughs, and disruptive new technologies",
    href: "/tech?tab=innovation",
    icon: Lightbulb,
    gradient: "from-amber-500/20 to-orange-600/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    badge: "HN",
  },
  {
    name: "Trending Tech",
    description: "The most-discussed technology stories right now",
    href: "/tech",
    icon: Flame,
    gradient: "from-pink-500/20 to-rose-600/10",
    border: "border-pink-500/20",
    text: "text-pink-400",
    bg: "bg-pink-500/10",
    badge: "dev.to · HN",
  },
];

export default function Explore() {
  const { data } = useArticles({ limit: 100 });
  const articles = data?.results || [];

  const getCategoryCount = (keywords: string[]) => {
    if (keywords.length === 0) {
      return articles.filter(
        a => differenceInHours(new Date(), new Date(a.published_at)) < 24
      ).length;
    }
    return articles.filter(a => {
      const text = (a.title + " " + a.summary).toLowerCase();
      return keywords.some(k => text.includes(k.toLowerCase()));
    }).length;
  };

  return (
    <div className="container mx-auto px-4 py-12 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Explore Everything
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Dive deep into space exploration, computer science, artificial intelligence,
          scientific research, and the innovations reshaping our world.
        </p>
      </motion.div>

      {/* Space Categories */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <Rocket className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Space & Astronomy</h2>
          <span className="text-xs font-mono text-muted-foreground ml-auto">
            via Spaceflight News API
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPACE_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            const count = getCategoryCount(cat.keywords);
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={cat.href}>
                  <div
                    className={`group relative flex flex-col p-6 rounded-2xl border bg-gradient-to-br ${cat.gradient} ${cat.border} hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer h-full`}
                    data-testid={`link-explore-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${cat.text}`} />
                    </div>
                    <h3 className="text-base font-bold mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
                      {cat.description}
                    </p>
                    <div className={`text-xs font-mono ${cat.text}`}>
                      {count} recent article{count !== 1 ? "s" : ""}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tech & Innovation Categories */}
      <div>
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <Newspaper className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold">Tech, Science & Innovation</h2>
          <span className="text-xs font-mono text-muted-foreground ml-auto">
            via dev.to · Hacker News
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <Link href={cat.href}>
                  <div
                    className={`group relative flex flex-col p-6 rounded-2xl border bg-gradient-to-br ${cat.gradient} ${cat.border} hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer h-full`}
                    data-testid={`link-explore-tech-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${cat.text}`} />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${cat.border} ${cat.text} opacity-70`}>
                        {cat.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
