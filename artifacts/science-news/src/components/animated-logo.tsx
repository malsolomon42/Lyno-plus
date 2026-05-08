import { motion } from "framer-motion";

interface AnimatedLogoProps {
  size?: "sm" | "md";
  showText?: boolean;
}

export function AnimatedLogo({ size = "md", showText = true }: AnimatedLogoProps) {
  const dim = size === "sm" ? 30 : 36;
  const fontSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="relative flex-shrink-0" style={{ width: dim, height: dim }}>

        {/* Pulsing ambient glow */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              "0 0 0px 0px hsl(var(--primary) / 0)",
              "0 0 14px 4px hsl(var(--primary) / 0.25)",
              "0 0 0px 0px hsl(var(--primary) / 0)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        />

        {/* Base background tile */}
        <div className="absolute inset-0 rounded-xl bg-primary/15 border border-primary/20" />

        {/* Rotating orbit ring + planet */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
        >
          <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
            {/* Dashed orbit circle */}
            <circle
              cx="18"
              cy="18"
              r="14"
              stroke="hsl(var(--primary))"
              strokeWidth="1.2"
              strokeDasharray="3.5 7"
              opacity="0.45"
            />
            {/* Orbiting planet dot */}
            <circle cx="18" cy="4" r="2.8" fill="hsl(var(--primary))" />
            {/* Trailing glow behind planet */}
            <circle cx="18" cy="4" r="4" fill="hsl(var(--primary))" opacity="0.2" />
          </svg>
        </motion.div>

        {/* Counter-rotating inner accent ring */}
        <motion.div
          className="absolute inset-2"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
        >
          <svg viewBox="0 0 22 22" fill="none" className="w-full h-full">
            <circle
              cx="11"
              cy="11"
              r="9"
              stroke="hsl(var(--primary))"
              strokeWidth="0.8"
              strokeDasharray="1.5 9"
              opacity="0.2"
            />
          </svg>
        </motion.div>

        {/* Center mark — "L+" */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`font-black text-primary font-mono leading-none ${fontSize}`}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          >
            L+
          </motion.span>
        </div>
      </div>

      {showText && (
        <motion.span
          className="font-mono text-xl font-bold tracking-tight"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          lyno<motion.span
            className="text-primary"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          >+</motion.span>
        </motion.span>
      )}
    </div>
  );
}
