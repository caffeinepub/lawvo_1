import { Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "../i18n/useTranslation";
import { VakyomLogo } from "./VakyomLogo";

interface WelcomeSplashProps {
  onDismiss: () => void;
}

// Split text into chunks of max `maxLen` characters, breaking at sentence boundaries
function splitIntoChunks(text: string, maxLen = 180): string[] {
  const sentences = text.split(/(?<=[।.!?])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    if (`${current} ${s}`.trim().length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = s;
    } else {
      current = current ? `${current} ${s}` : s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text.slice(0, maxLen)];
}

// Build Google Translate TTS URL (works in all browsers, supports all Indian languages)
function ttsUrl(text: string, lang: string): string {
  const langCode = lang.split("-")[0]; // "kn-IN" → "kn"
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${langCode}&client=tw-ob`;
}

export function WelcomeSplash({ onDismiss }: WelcomeSplashProps) {
  const { t } = useTranslation();
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef(0);
  const stoppedRef = useRef(false);

  const stopAudio = useCallback(() => {
    stoppedRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  const playChunk = useCallback(
    (index: number) => {
      if (stoppedRef.current || mutedRef.current) return;
      const chunks = chunksRef.current;
      if (index >= chunks.length) {
        setSpeaking(false);
        return;
      }
      setSpeaking(true);
      const url = ttsUrl(chunks[index], t.welcome_speech_lang);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        chunkIndexRef.current = index + 1;
        playChunk(index + 1);
      };
      audio.onerror = () => {
        setSpeaking(false);
      };
      audio.play().catch(() => setSpeaking(false));
    },
    [t.welcome_speech_lang],
  );

  const speakMessage = useCallback(() => {
    if (mutedRef.current) return;
    stopAudio();
    stoppedRef.current = false;
    chunksRef.current = splitIntoChunks(t.welcome_speech);
    chunkIndexRef.current = 0;
    playChunk(0);
  }, [t.welcome_speech, stopAudio, playChunk]);

  useEffect(() => {
    const timer = setTimeout(speakMessage, 800);
    return () => {
      clearTimeout(timer);
      stopAudio();
    };
  }, [speakMessage, stopAudio]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    if (next) {
      stopAudio();
    } else {
      speakMessage();
    }
  };

  const handleDismiss = () => {
    stopAudio();
    onDismiss();
  };

  const speechLines = t.welcome_speech
    .split(/[.।]\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => `${s}.`);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(5, 10, 30, 0.92)" }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, oklch(0.72 0.14 78 / 0.25) 0%, transparent 70%)",
          }}
        />

        <motion.div
          className="relative w-full max-w-md rounded-3xl overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 18, stiffness: 220 }}
          style={{
            background: "oklch(0.13 0.04 250)",
            border: "2px solid oklch(0.72 0.14 78 / 0.6)",
            boxShadow:
              "0 0 60px oklch(0.72 0.14 78 / 0.4), 0 0 120px oklch(0.72 0.14 78 / 0.15)",
          }}
        >
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.72 0.14 78), transparent)",
            }}
          />

          <div className="p-8 text-center">
            <motion.div
              className="flex justify-center mb-5"
              animate={speaking ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={
                speaking
                  ? { duration: 1.2, repeat: Number.POSITIVE_INFINITY }
                  : {}
              }
            >
              <div
                className="rounded-2xl p-3"
                style={{
                  background: "white",
                  boxShadow: speaking
                    ? "0 0 30px oklch(0.72 0.14 78 / 0.8)"
                    : "0 0 15px oklch(0.72 0.14 78 / 0.4)",
                  transition: "box-shadow 0.3s",
                }}
              >
                <VakyomLogo size={60} />
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl font-display font-bold mb-1"
              style={{ color: "oklch(0.72 0.14 78)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Vakyom
            </motion.h1>
            <motion.p
              className="text-white/50 text-sm mb-6 font-display italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t.splash_tagline}
            </motion.p>

            <motion.div
              className="rounded-2xl p-5 mb-6 text-left space-y-3"
              style={{
                background: "oklch(0.18 0.05 250)",
                border: "1px solid oklch(0.72 0.14 78 / 0.25)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {speechLines.map((line, i) => (
                <motion.p
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  key={i}
                  className="text-sm leading-relaxed"
                  style={{
                    color:
                      i === 0
                        ? "oklch(0.72 0.14 78)"
                        : "rgba(255,255,255,0.80)",
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>

            {speaking && (
              <motion.div
                className="flex items-center justify-center gap-1 mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full"
                    style={{ backgroundColor: "oklch(0.72 0.14 78)" }}
                    animate={{ height: [4, 16, 4] }}
                    transition={{
                      duration: 0.6,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                ))}
                <span
                  className="ml-2 text-xs"
                  style={{ color: "oklch(0.72 0.14 78)" }}
                >
                  {t.splash_speaking}
                </span>
              </motion.div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={toggleMute}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "oklch(0.18 0.05 250)",
                  border: "1px solid oklch(0.72 0.14 78 / 0.3)",
                  color: muted
                    ? "rgba(255,255,255,0.4)"
                    : "oklch(0.72 0.14 78)",
                }}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                {muted ? t.splash_unmute : t.splash_mute}
              </button>
              <motion.button
                type="button"
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: "oklch(0.72 0.14 78)",
                  color: "oklch(0.13 0.04 250)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {t.splash_continue}
              </motion.button>
            </div>
          </div>

          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.72 0.14 78), transparent)",
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
