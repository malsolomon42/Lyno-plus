import { useState, useEffect } from "react";
import { useUpcomingLaunches, Launch } from "@/hooks/use-launches";
import { useTTS } from "@/hooks/use-tts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket, MapPin, Volume2, Square, Globe, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
}

function useCountdown(netDate: string): Countdown {
  const [countdown, setCountdown] = useState<Countdown>(() => calc(netDate));

  useEffect(() => {
    const id = setInterval(() => setCountdown(calc(netDate)), 1000);
    return () => clearInterval(id);
  }, [netDate]);

  return countdown;
}

function calc(netDate: string): Countdown {
  const diff = new Date(netDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    past: false,
  };
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function statusColor(abbrev: string) {
  if (abbrev === "Go") return "bg-green-500/15 text-green-400 border-green-500/30";
  if (abbrev === "TBC") return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  if (abbrev === "TBD") return "bg-muted/50 text-muted-foreground border-white/10";
  if (abbrev === "Success") return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  return "bg-muted/50 text-muted-foreground border-white/10";
}

function CountdownBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl md:text-3xl font-bold font-mono tabular-nums"
      >
        {pad(value)}
      </motion.span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{label}</span>
    </div>
  );
}

function LaunchCard({ launch, index }: { launch: Launch; index: number }) {
  const countdown = useCountdown(launch.net);
  const { speak, stop, speaking } = useTTS();

  const readLaunch = () => {
    const netLabel = countdown.past
      ? "has already launched"
      : countdown.days > 0
        ? `launches in ${countdown.days} days, ${countdown.hours} hours`
        : `launches in ${countdown.hours} hours, ${countdown.minutes} minutes`;
    const mission = launch.mission?.description
      ? ` Mission: ${launch.mission.description.slice(0, 200)}.`
      : "";
    const text = `${launch.name} by ${launch.launch_service_provider.name} ${netLabel}. Launching from ${launch.pad.location.name}.${mission}`;
    speaking ? stop() : speak(text, { rate: 0.88 });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="group bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300"
      data-testid={`launch-card-${launch.id}`}
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-background to-muted/50">
        {launch.image ? (
          <img
            src={launch.image}
            alt={launch.name}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Rocket className="w-12 h-12 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`text-xs border ${statusColor(launch.status.abbrev)}`}>
            {launch.status.abbrev === "Go" && <span className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
            {launch.status.name}
          </Badge>
        </div>
        <button
          onClick={readLaunch}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
            speaking ? "bg-primary/30 border-primary/50 text-primary" : "bg-background/70 border-white/15 text-muted-foreground hover:text-primary hover:border-primary/40"
          }`}
          title="Listen to launch details"
          data-testid={`btn-read-launch-${launch.id}`}
        >
          {speaking ? <Square className="w-3.5 h-3.5 fill-primary" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {launch.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          {launch.launch_service_provider.name} · {launch.rocket.configuration.name}
        </p>

        {/* Countdown */}
        {!countdown.past ? (
          <div className="flex items-center gap-3 bg-muted/30 border border-white/5 rounded-xl px-4 py-3 mb-3">
            <CountdownBlock label="Days" value={countdown.days} />
            <span className="text-muted-foreground font-bold">:</span>
            <CountdownBlock label="Hrs" value={countdown.hours} />
            <span className="text-muted-foreground font-bold">:</span>
            <CountdownBlock label="Min" value={countdown.minutes} />
            <span className="text-muted-foreground font-bold">:</span>
            <CountdownBlock label="Sec" value={countdown.seconds} />
          </div>
        ) : (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2.5 mb-3 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Launched</span>
          </div>
        )}

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{launch.pad.name}, {launch.pad.location.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-mono">
              NET {format(new Date(launch.net), "MMM d, yyyy · HH:mm 'UTC'")}
            </span>
          </div>
        </div>

        {launch.mission?.description && (
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed line-clamp-2 border-t border-white/5 pt-3">
            {launch.mission.description}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export default function Launches() {
  const { data, isLoading, error } = useUpcomingLaunches();
  const { speak, stop, speaking } = useTTS();

  const readAll = () => {
    if (speaking) { stop(); return; }
    const launches = data?.results.slice(0, 5) || [];
    const text = launches.map((l, i) => {
      const cd = calc(l.net);
      const when = cd.past ? "already launched" : cd.days > 0 ? `in ${cd.days} days` : `in ${cd.hours} hours`;
      return `${i + 1}. ${l.name} ${when}`;
    }).join(". ");
    speak(`Here are the next ${launches.length} upcoming launches. ${text}`, { rate: 0.87 });
  };

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="w-6 h-6 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">Live Countdowns</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-2">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Upcoming Launches</h1>
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full gap-2 mb-1 border-white/15 hover:border-primary/40 ${speaking ? "border-primary/40 text-primary bg-primary/5" : ""}`}
                onClick={readAll}
                data-testid="btn-read-all-launches"
              >
                {speaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                {speaking ? "Stop" : "Listen to Schedule"}
              </Button>
            </div>
            <p className="text-muted-foreground text-lg">
              Real-time countdowns to the next rockets lifting off from Earth.
              Tap <Volume2 className="w-4 h-4 inline mx-1 text-primary" /> on any card to hear it read aloud.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/5">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Unable to Reach Launch Control</h2>
            <p className="text-muted-foreground mb-6">
              The launch schedule API may be rate-limited. Please try again in a moment.
            </p>
            <Button variant="outline" className="rounded-full" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-mono">
                {data?.count ?? 0} launches on the manifest · Countdowns update every second
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.results.map((launch, i) => (
                <LaunchCard key={launch.id} launch={launch} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
