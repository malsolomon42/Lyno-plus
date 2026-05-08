import { useAuth } from "@workspace/replit-auth-web";
import { AnimatedLogo } from "@/components/animated-logo";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Rocket, Satellite, Star, Telescope, Globe, Zap } from "lucide-react";

const FEATURES = [
  { icon: Rocket, text: "Live launch countdowns" },
  { icon: Satellite, text: "Real-time space news" },
  { icon: Globe, text: "Mars & Moon missions" },
  { icon: Telescope, text: "Deep space discoveries" },
  { icon: Zap, text: "Tech & AI breakthroughs" },
  { icon: Star, text: "Voice-powered reading" },
];

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));

export default function LoginPage({ onGuest }: { onGuest: () => void }) {
  const { login } = useAuth();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, hsl(217 91% 8% / 1) 0%, hsl(0 0% 3%) 60%)",
      }}
    >
      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {STARS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
            }}
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: s.duration,
              delay: s.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Nebula blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "-10%",
          width: "55vw",
          height: "55vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, hsl(217 91% 50% / 0.08) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "5%",
          right: "-5%",
          width: "45vw",
          height: "45vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, hsl(263 70% 50% / 0.07) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 py-10 max-w-md w-full mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AnimatedLogo size="md" showText={true} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your mission control
          <br />
          <span style={{ color: "#60a5fa" }}>for the cosmos</span>
        </motion.h1>

        <motion.p
          className="text-base text-white/60 mb-8 leading-relaxed max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Space exploration, science breakthroughs, AI, and tech — delivered
          live.
        </motion.p>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-2 gap-2.5 w-full mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {FEATURES.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-white/70"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#60a5fa" }} />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center gap-3 w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={login}
            className="w-full h-12 text-base font-semibold rounded-xl"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              border: "none",
              color: "#fff",
              boxShadow: "0 0 24px rgba(59,130,246,0.4)",
            }}
          >
            Log in to lyno+
          </Button>

          <button
            onClick={onGuest}
            className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-2 mt-1"
          >
            Continue browsing without logging in
          </button>
        </motion.div>

        <motion.p
          className="mt-8 text-xs text-white/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Your data stays private. No spam, ever.
        </motion.p>
      </motion.div>
    </div>
  );
}
