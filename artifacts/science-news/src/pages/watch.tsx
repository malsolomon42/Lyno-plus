import { Link } from "wouter";
import { ArrowUpRight, Clapperboard, ExternalLink, Play, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useExpertVideos } from "@/hooks/use-expert-videos";

export default function Watch() {
  const { data: videos = [], isLoading } = useExpertVideos();

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,hsl(193_66%_56%/.18),transparent_30rem)]" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-[.22em] font-mono mb-5">
              <Clapperboard className="w-4 h-4" /> The watch desk
            </div>
            <h1 className="font-editorial text-5xl md:text-7xl leading-[.95] max-w-3xl">
              Learn from the people <em className="text-primary">doing the work.</em>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              A carefully selected video desk for serious curiosity: scientists, engineers, educators and specialist voices with something real to teach.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs text-primary font-mono"><ShieldCheck className="w-3.5 h-3.5" /> Official channels & trusted publishers</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-muted-foreground font-mono">Updated by YouTube channels</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-12">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div><p className="text-xs uppercase tracking-[.2em] text-cyan-300 font-mono mb-2">Expert signal</p><h2 className="text-2xl md:text-3xl font-bold">What’s worth your attention</h2></div>
          <Link href="/explore"><Button variant="ghost" className="hidden sm:flex gap-2 text-muted-foreground">Explore topics <ArrowUpRight className="w-4 h-4" /></Button></Link>
        </div>
        {isLoading ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({ length: 6 }).map((_, i) => <div className="aspect-[1.35] rounded-2xl bg-card animate-pulse" key={i} />)}</div> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video, index) => (
              <motion.article key={video.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }} className="group rounded-2xl overflow-hidden border border-white/10 bg-card hover:border-primary/35 transition-colors">
                <div className="relative aspect-[1.65] overflow-hidden">
                  <img src={video.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                  <div className="absolute left-4 bottom-4 flex items-center gap-2 text-xs font-mono text-white"><span className="rounded-full bg-primary text-primary-foreground p-2"><Play className="w-3.5 h-3.5 fill-current" /></span> Watch latest</div>
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[.18em] text-cyan-300 font-mono mb-2">{video.focus}</p>
                  <h3 className="text-xl font-semibold mb-2">{video.expert}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{video.description}</p>
                  <div className="flex items-center justify-between gap-3">
                    <a href={video.latestUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1.5">Open latest <ExternalLink className="w-3.5 h-3.5" /></a>
                    <span className="text-[10px] text-muted-foreground font-mono">{video.sourceLabel}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground/70 mt-7 max-w-2xl">lyno+ links to public videos hosted by their original publishers. Video availability, titles and release dates are controlled by those publishers; we do not fabricate or rewrite their claims.</p>
      </section>
    </div>
  );
}
