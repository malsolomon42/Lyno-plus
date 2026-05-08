import { useId } from "react";
import { motion } from "framer-motion";

interface AnimatedLogoProps {
  size?: "sm" | "md";
  showText?: boolean;
}

export function AnimatedLogo({ size = "sm", showText = true }: AnimatedLogoProps) {
  const uid = useId().replace(/:/g, "");
  const dim = size === "sm" ? 40 : 52;

  const bgId = `bg-${uid}`;
  const glowId = `glow-${uid}`;
  const textId = `tg-${uid}`;
  const blurId = `bl-${uid}`;
  const ring2GlowId = `r2g-${uid}`;

  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative flex-shrink-0" style={{ width: dim, height: dim }}>

        {/* ── Bloom glow behind the entire icon ─────────────────── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: "-10px",
            borderRadius: "20px",
            background:
              "radial-gradient(ellipse at 50% 50%, hsl(217 91% 60% / 0.55) 0%, hsl(263 70% 50% / 0.18) 45%, transparent 70%)",
            filter: "blur(10px)",
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.92, 1.06, 0.92] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
        />

        {/* ── Main SVG icon ──────────────────────────────────────── */}
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "relative", zIndex: 10 }}
        >
          <defs>
            {/* Background radial: deep-navy center → near-black edge */}
            <radialGradient id={bgId} cx="40%" cy="35%" r="70%">
              <stop offset="0%"   stopColor="#1b2d5a" />
              <stop offset="55%"  stopColor="#0b1020" />
              <stop offset="100%" stopColor="#050710" />
            </radialGradient>

            {/* Core glow radial */}
            <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.75" />
              <stop offset="60%"  stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>

            {/* Ring-2 planet glow radial */}
            <radialGradient id={ring2GlowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </radialGradient>

            {/* "L+" text gradient: cyan → violet */}
            <linearGradient id={textId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#67e8f9" />
              <stop offset="50%"  stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>

            {/* Blur for halos */}
            <filter id={blurId} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
            </filter>
          </defs>

          {/* Background tile */}
          <rect width="48" height="48" rx="12" fill={`url(#${bgId})`} />

          {/* Subtle border */}
          <rect
            width="48" height="48" rx="12"
            stroke="#3b82f6" strokeWidth="0.9" strokeOpacity="0.35" fill="none"
          />

          {/* ── Pulsing core glow ─── */}
          <motion.g
            style={{ transformOrigin: "24px 24px" }}
            animate={{ scale: [0.75, 1.15, 0.75], opacity: [0.55, 1, 0.55] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
          >
            <circle cx="24" cy="24" r="11" fill={`url(#${glowId})`} />
          </motion.g>

          {/* ── Outer ring (CW, 5s) with bright planet ─── */}
          <motion.g
            style={{ transformOrigin: "24px 24px" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          >
            {/* Dashed orbit path */}
            <circle
              cx="24" cy="24" r="21"
              stroke="#60a5fa" strokeWidth="1.3"
              strokeDasharray="4.5 10" strokeOpacity="0.55"
            />
            {/* Planet halo (blurred) */}
            <circle cx="24" cy="3" r="6" fill="#3b82f6" filter={`url(#${blurId})`} opacity="0.6" />
            {/* Planet core */}
            <circle cx="24" cy="3" r="3.2" fill="#93c5fd" />
            {/* Planet bright spot */}
            <circle cx="23" cy="2.3" r="1" fill="white" fillOpacity="0.7" />
          </motion.g>

          {/* ── Inner ring (CCW, 8.5s) with violet dot ─── */}
          <motion.g
            style={{ transformOrigin: "24px 24px" }}
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8.5, ease: "linear" }}
          >
            {/* Dashed orbit path */}
            <circle
              cx="24" cy="24" r="14"
              stroke="#818cf8" strokeWidth="1"
              strokeDasharray="3 8" strokeOpacity="0.45"
            />
            {/* Dot halo */}
            <circle cx="24" cy="10" r="4" fill="#a78bfa" filter={`url(#${blurId})`} opacity="0.5" />
            {/* Dot core */}
            <circle cx="24" cy="10" r="2.2" fill="#c4b5fd" />
            <circle cx="23.4" cy="9.4" r="0.7" fill="white" fillOpacity="0.6" />
          </motion.g>

          {/* ── Third tiny orbit (CW, 13s) — depth layer ─── */}
          <motion.g
            style={{ transformOrigin: "24px 24px" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 13, ease: "linear" }}
          >
            <circle
              cx="24" cy="24" r="7"
              stroke="#38bdf8" strokeWidth="0.7"
              strokeDasharray="1.5 5" strokeOpacity="0.3"
            />
            <circle cx="24" cy="17" r="1.1" fill="#7dd3fc" fillOpacity="0.8" />
          </motion.g>

          {/* ── Centre backing circle ─── */}
          <circle cx="24" cy="24" r="8.5" fill="#05070f" fillOpacity="0.96" />
          <circle
            cx="24" cy="24" r="8.5"
            stroke="#60a5fa" strokeWidth="0.9" strokeOpacity="0.5" fill="none"
          />

          {/* ── "L+" centre glyph ─── */}
          <motion.g
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
          >
            <text
              x="24" y="24"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Courier New', Courier, monospace"
              fontSize="10.5"
              fontWeight="900"
              fill={`url(#${textId})`}
              letterSpacing="-0.6"
            >L+</text>
          </motion.g>
        </svg>
      </div>

      {showText && (
        <motion.span
          className="font-mono text-xl font-bold tracking-tight text-foreground"
          animate={{ opacity: [0.88, 1, 0.88] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
        >
          lyno<motion.span
            style={{ color: "#60a5fa" }}
            animate={{
              textShadow: [
                "0 0 0px #60a5fa",
                "0 0 8px #60a5fa, 0 0 16px #818cf8",
                "0 0 0px #60a5fa",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
          >+</motion.span>
        </motion.span>
      )}
    </div>
  );
}
