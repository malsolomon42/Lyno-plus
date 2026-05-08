import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Mic, MicOff, X, Volume2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTTS } from "@/hooks/use-tts";
import { motion, AnimatePresence } from "framer-motion";

type Status = "idle" | "listening" | "processing" | "speaking";

const COMMANDS_HELP = [
  { phrase: '"Read this article"', desc: "Read article aloud" },
  { phrase: '"Latest news"', desc: "Hear top headlines" },
  { phrase: '"Go to launches"', desc: "Launch countdown page" },
  { phrase: '"Go home"', desc: "Home page" },
  { phrase: '"Go to explore"', desc: "Explore all topics" },
  { phrase: '"Go to support"', desc: "Support lyno+" },
  { phrase: '"Stop" / "Cancel"', desc: "Stop all audio" },
  { phrase: '"Help"', desc: "List commands" },
];

const GREETINGS = [
  "lyno plus assistant ready. What can I help you explore?",
  "Hello! I can read articles, navigate pages, and share news. What would you like?",
  "Mission control online. Ask me anything about today's space news.",
];

function matchCommand(transcript: string): string {
  const t = transcript.toLowerCase().trim();
  if (/(stop|cancel|quiet|silence|mute|shut up|enough)/.test(t)) return "stop";
  if (/(home|main page|go home|start|homepage)/.test(t)) return "home";
  if (/(launch|countdown|rocket|upcoming|liftoff)/.test(t)) return "launches";
  if (/(explore|topics|discover|all topics)/.test(t)) return "explore";
  if (/(support|donate|help us|fund)/.test(t)) return "support";
  if (/(search|find|look for)/.test(t)) return "search";
  if (/(bookmark|saved|reading list)/.test(t)) return "bookmarks";
  if (/(about|who are you|what is cosmoswire|mission)/.test(t)) return "about";
  if (/(read|listen|play|aloud|narrate|speak|article)/.test(t)) return "read";
  if (/(latest|headline|top|news|recent|today)/.test(t)) return "headlines";
  if (/(help|command|what can you|what do you|options)/.test(t)) return "help";
  return "unknown";
}

export function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any>(null);
  const [, navigate] = useLocation();
  const { speak, stop: stopTTS, supported: ttsSupported } = useTTS();
  const hasSpokenGreeting = useRef(false);
  const processingRef = useRef(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SR = typeof window !== "undefined"
    ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    : null;
  const srSupported = !!SR;

  const respond = useCallback((text: string, onDone?: () => void) => {
    setResponse(text);
    setStatus("speaking");
    speak(text, { rate: 0.9, onEnd: () => { setStatus("idle"); onDone?.(); } });
  }, [speak]);

  const processCommand = useCallback((text: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setStatus("processing");
    setTranscript(text);

    const cmd = matchCommand(text);

    setTimeout(() => {
      processingRef.current = false;
      switch (cmd) {
        case "stop":
          stopTTS();
          respond("Stopping all audio. Standing by.");
          break;
        case "home":
          respond("Taking you to the home page now.", () => navigate("/"));
          break;
        case "launches":
          respond("Opening the launch countdown page.", () => navigate("/launches"));
          break;
        case "explore":
          respond("Opening the explore page.", () => navigate("/explore"));
          break;
        case "support":
          respond("Opening the support page.", () => navigate("/support"));
          break;
        case "search":
          respond("Opening the search page.", () => navigate("/search"));
          break;
        case "bookmarks":
          respond("Opening your saved articles.", () => navigate("/bookmarks"));
          break;
        case "about":
          respond("lyno plus is your mission control for space exploration news. We deliver real-time updates from the world's leading space agencies and science institutions.");
          break;
        case "read":
          respond("To listen to an article, open any article and press the Play button in the Listen to Article section.");
          break;
        case "headlines":
          respond("I'm fetching today's latest space news for you. Navigate to the home page to see the full list.");
          break;
        case "help":
          respond("You can say: go home, go to launches, go to explore, go to support, read this article, latest news, or stop. How can I help?");
          break;
        default:
          respond("I didn't quite catch that. Try saying: go home, go to launches, read headlines, or help for a full command list.");
      }
    }, 400);
  }, [respond, stopTTS, navigate]);

  const startListening = useCallback(() => {
    if (!SR || !open) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onstart = () => setStatus("listening");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const interim = Array.from(e.results as any[])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript)
        .join("");
      setTranscript(interim);
      if (e.results[e.results.length - 1].isFinal) {
        const final = e.results[e.results.length - 1][0].transcript;
        rec.stop();
        processCommand(final);
      }
    };
    rec.onerror = () => { setStatus("idle"); setTranscript(""); };
    rec.onend = () => { if (status === "listening") setStatus("idle"); };
    rec.start();
    setRecognition(rec);
  }, [SR, open, processCommand, status]);

  const stopListening = useCallback(() => {
    recognition?.stop();
    setStatus("idle");
    setTranscript("");
  }, [recognition]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setStatus("idle");
    setTranscript("");
    setResponse("");
    if (!hasSpokenGreeting.current) {
      hasSpokenGreeting.current = true;
      const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setTimeout(() => respond(greeting), 300);
    }
  }, [respond]);

  const handleClose = useCallback(() => {
    stopListening();
    stopTTS();
    setOpen(false);
    setStatus("idle");
    setTranscript("");
  }, [stopListening, stopTTS]);

  const handleMicClick = useCallback(() => {
    if (status === "listening") {
      stopListening();
    } else if (status === "idle") {
      startListening();
    }
  }, [status, startListening, stopListening]);

  useEffect(() => {
    return () => { recognition?.stop(); };
  }, [recognition]);

  if (!ttsSupported) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ delay: 4 }}
            onClick={handleOpen}
            className="fixed bottom-8 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-200 flex items-center justify-center border border-primary/30"
            data-testid="btn-open-voice"
            title="Open Voice Assistant"
          >
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Assistant Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[340px] rounded-3xl border border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/15 overflow-hidden"
            data-testid="voice-assistant-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-inner">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">lyno+ AI</p>
                  <p className="text-xs text-muted-foreground font-mono">Voice Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => setShowHelp(s => !s)}>
                  {showHelp ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive" onClick={handleClose} data-testid="btn-close-voice">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Status Area */}
            <div className="px-5 py-5">
              {/* Status Indicator */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  status === "listening" ? "bg-red-500 animate-pulse" :
                  status === "speaking" ? "bg-primary animate-pulse" :
                  status === "processing" ? "bg-yellow-500 animate-pulse" :
                  "bg-muted-foreground/40"
                }`} />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {status === "listening" ? "Listening..." :
                   status === "speaking" ? "Speaking..." :
                   status === "processing" ? "Processing..." :
                   "Ready"}
                </span>
                {status === "speaking" && (
                  <div className="flex items-end gap-0.5 ml-auto">
                    {[1,2,3,4,5].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: [3, 12, 3] }}
                        transition={{ duration: 0.5, delay: i * 0.08, repeat: Infinity }}
                        className="w-0.5 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Transcript */}
              <div className="min-h-[56px] bg-muted/30 rounded-xl px-4 py-3 mb-4 border border-white/5">
                {transcript ? (
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    &ldquo;{transcript}&rdquo;
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/50">
                    {status === "listening" ? "Speak now..." : "Your words will appear here"}
                  </p>
                )}
              </div>

              {/* Response */}
              {response && (
                <div className="bg-primary/8 border border-primary/15 rounded-xl px-4 py-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm leading-relaxed text-foreground">{response}</p>
                  </div>
                </div>
              )}

              {/* Mic Button */}
              {srSupported ? (
                <div className="flex flex-col items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleMicClick}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                      status === "listening"
                        ? "bg-red-500/20 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                        : "bg-primary/15 border border-primary/40 hover:bg-primary/25 hover:border-primary/60"
                    }`}
                    data-testid="btn-mic"
                  >
                    <AnimatePresence mode="wait">
                      {status === "listening" ? (
                        <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <MicOff className="w-6 h-6 text-red-400" />
                        </motion.div>
                      ) : (
                        <motion.div key="on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Mic className="w-6 h-6 text-primary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  <p className="text-xs text-muted-foreground font-mono">
                    {status === "listening" ? "Tap to stop" : "Tap to speak"}
                  </p>
                </div>
              ) : (
                <div className="text-center py-3 text-xs text-muted-foreground">
                  <p className="mb-1 font-medium">Voice input not supported in this browser.</p>
                  <p>Text-to-speech is still available for article reading.</p>
                </div>
              )}
            </div>

            {/* Command Help */}
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-white/10"
                >
                  <div className="px-5 py-4 bg-muted/20">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                      Voice Commands
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {COMMANDS_HELP.map(c => (
                        <div key={c.phrase} className="flex items-start justify-between gap-2">
                          <code className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md font-mono">
                            {c.phrase}
                          </code>
                          <span className="text-xs text-muted-foreground text-right">{c.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
