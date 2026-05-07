import { useState, useCallback, useEffect, useRef } from "react";

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    setSupported("speechSynthesis" in window);

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find(
          v =>
            (v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Karen") ||
              v.name.includes("Daniel")) &&
            v.lang.startsWith("en")
        ) ||
        voices.find(v => v.lang === "en-US" && !v.localService) ||
        voices.find(v => v.lang.startsWith("en-US")) ||
        voices[0] ||
        null;
    };

    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
  }, []);

  const speak = useCallback((text: string, opts?: { rate?: number; onEnd?: () => void }) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utt.voice = voiceRef.current;
    utt.rate = opts?.rate ?? 0.93;
    utt.pitch = 1.05;
    utt.volume = 1;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => { setSpeaking(false); setPaused(false); opts?.onEnd?.(); };
    utt.onerror = () => { setSpeaking(false); setPaused(false); };
    window.speechSynthesis.speak(utt);
  }, []);

  const pause = useCallback(() => { window.speechSynthesis.pause(); setPaused(true); }, []);
  const resume = useCallback(() => { window.speechSynthesis.resume(); setPaused(false); }, []);
  const stop = useCallback(() => { window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false); }, []);

  return { speak, pause, resume, stop, speaking, paused, supported };
}
