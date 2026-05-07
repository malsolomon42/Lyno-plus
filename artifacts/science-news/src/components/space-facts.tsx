import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FACTS = [
  "A day on Venus is longer than a year on Venus — it rotates slower than it orbits the Sun.",
  "Neutron stars are so dense that a teaspoon of their matter would weigh about 10 million tons on Earth.",
  "The Milky Way galaxy contains an estimated 100–400 billion stars, and there are roughly 2 trillion galaxies in the observable universe.",
  "Sound cannot travel in space — there is no medium for sound waves to propagate through the vacuum.",
  "One million Earths could fit inside the Sun, yet the Sun is considered an average-sized star.",
  "The footprints left by Apollo astronauts on the Moon will last for millions of years — there is no wind or rain to erode them.",
  "Saturn's rings are only about 10 meters thick on average, yet they span up to 282,000 kilometers in diameter.",
  "A year on Mercury is just 88 Earth days, yet a single Mercurian day lasts 59 Earth days.",
  "The Voyager 1 spacecraft, launched in 1977, is now over 23 billion kilometers from Earth — the farthest human-made object.",
  "Black holes don't suck — objects must cross the event horizon to be captured. From a distance, their gravity is normal.",
  "Mars has the tallest volcano in the solar system: Olympus Mons, standing 22 km high — nearly 3x taller than Everest.",
  "The universe is approximately 13.8 billion years old. Earth formed about 4.5 billion years ago.",
  "Jupiter's Great Red Spot is a storm that has been raging for over 350 years and is larger than Earth.",
  "There are more stars in the observable universe than grains of sand on all of Earth's beaches combined.",
  "Light from the Sun takes 8 minutes 20 seconds to reach Earth. Light from the nearest star takes 4.24 years.",
  "Water ice has been confirmed on the Moon's poles, opening possibilities for future lunar settlements.",
  "The ISS travels at about 28,000 km/h, completing one orbit of Earth every 90 minutes.",
];

export function SpaceFacts() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * FACTS.length));
  const [direction, setDirection] = useState(1);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex(prev => (prev + dir + FACTS.length) % FACTS.length);
  };

  useEffect(() => {
    const timer = setInterval(() => go(1), 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container mx-auto px-4">
      <div className="rounded-3xl border border-secondary/20 bg-secondary/5 p-8 md:p-10">
        <div className="flex items-center gap-3 mb-5">
          <Star className="w-5 h-5 text-secondary fill-secondary/30" />
          <h2 className="text-sm font-semibold tracking-widest uppercase text-secondary font-mono">
            Did You Know?
          </h2>
        </div>
        <div className="relative overflow-hidden min-h-[72px] flex items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.p
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ duration: 0.35 }}
              className="text-lg md:text-xl font-medium leading-relaxed"
              data-testid="text-space-fact"
            >
              {FACTS[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-1.5 items-center">
            {FACTS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? "bg-secondary w-5 h-1.5"
                    : "bg-secondary/25 w-1.5 h-1.5"
                }`}
                aria-label={`Fact ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => go(-1)}
              data-testid="btn-fact-prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => go(1)}
              data-testid="btn-fact-next"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
