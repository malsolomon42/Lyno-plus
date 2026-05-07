import { Link } from "wouter";
import { motion } from "framer-motion";
import { Rocket, Globe, Moon, Star, Cpu, Telescope, Satellite, Flame, Atom } from "lucide-react";
import { useArticles } from "@/hooks/use-space-news";
import { differenceInHours } from "date-fns";

const CATEGORIES = [
  {
    name: "Launches",
    description: "Rocket missions, countdowns, and liftoff reports",
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
    icon: Telescope,
    gradient: "from-purple-500/20 to-indigo-600/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    keywords: ["galaxy", "nebula", "black hole", "telescope", "dark matter", "james webb"],
  },
  {
    name: "Technology",
    description: "Cutting-edge propulsion, AI in space, and new hardware",
    icon: Cpu,
    gradient: "from-cyan-500/20 to-blue-600/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    keywords: ["technology", "tech", "software", "hardware", "engine", "propulsion"],
  },
  {
    name: "Satellites",
    description: "Orbital infrastructure, Starlink, and the ISS",
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
    icon: Flame,
    gradient: "from-rose-500/20 to-pink-600/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    keywords: [],
  },
];

export default function Explore() {
  const { data } = useArticles({ limit: 100 });
  const articles = data?.results || [];

  const getCategoryCount = (keywords: string[]) => {
    if (keywords.length === 0) {
      return articles.filter(
        (a) => differenceInHours(new Date(), new Date(a.published_at)) < 24
      ).length;
    }
    return articles.filter((a) => {
      const text = (a.title + " " + a.summary).toLowerCase();
      return keywords.some((k) => text.includes(k.toLowerCase()));
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
          Explore the Cosmos
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Navigate by topic and dive deep into the fields of space science that
          captivate you most.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          const count = getCategoryCount(cat.keywords);
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/category/${cat.name}`}>
                <div
                  className={`group relative flex flex-col p-7 rounded-2xl border bg-gradient-to-br ${cat.gradient} ${cat.border} hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer`}
                  data-testid={`link-explore-${cat.name.toLowerCase()}`}
                >
                  <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center mb-5`}>
                    <Icon className={`w-6 h-6 ${cat.text}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
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
  );
}
