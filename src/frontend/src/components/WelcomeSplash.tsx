import { Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "../i18n/useTranslation";

interface WelcomeSplashProps {
  onDismiss: () => void;
  userName?: string;
}

// Speak text using Web Speech API
function speakText(
  text: string,
  lang: string,
  onEnd?: () => void,
  onError?: () => void,
) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;
  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  window.speechSynthesis.cancel();
}

// Animated AI Legal Character SVG
function AICharacter({ speaking }: { speaking: boolean }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 100, height: 100 }}
    >
      {/* Pulsing rings when speaking */}
      {speaking && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 90,
              height: 90,
              border: "2px solid oklch(0.72 0.14 78 / 0.6)",
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 90,
              height: 90,
              border: "2px solid oklch(0.72 0.14 78 / 0.4)",
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
              delay: 0.4,
            }}
          />
        </>
      )}

      {/* Main AI Character SVG */}
      <motion.svg
        aria-label="Vakyom AI Legal Guide"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={speaking ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={
          speaking ? { duration: 1.2, repeat: Number.POSITIVE_INFINITY } : {}
        }
        role="img"
      >
        <title>Vakyom AI Legal Guide</title>
        {/* Outer glow circle */}
        <circle
          cx="40"
          cy="40"
          r="38"
          fill="oklch(0.13 0.04 250)"
          stroke="oklch(0.72 0.14 78)"
          strokeWidth="2"
        />

        {/* Robe / body at bottom */}
        <path
          d="M16 72 Q24 58 40 56 Q56 58 64 72 Z"
          fill="oklch(0.65 0.12 78)"
        />
        <path
          d="M22 72 Q28 61 40 59 Q52 61 58 72 Z"
          fill="oklch(0.72 0.14 78)"
        />

        {/* Scales of Justice on chest */}
        <line
          x1="40"
          y1="62"
          x2="40"
          y2="68"
          stroke="oklch(0.13 0.04 250)"
          strokeWidth="1.2"
        />
        <line
          x1="34"
          y1="64"
          x2="46"
          y2="64"
          stroke="oklch(0.13 0.04 250)"
          strokeWidth="1.2"
        />
        <path
          d="M34 64 L31 67 L37 67 Z"
          fill="oklch(0.13 0.04 250)"
          opacity="0.7"
        />
        <path
          d="M46 64 L43 67 L49 67 Z"
          fill="oklch(0.13 0.04 250)"
          opacity="0.7"
        />

        {/* Head */}
        <circle cx="40" cy="35" r="18" fill="oklch(0.72 0.14 78)" />
        <circle cx="40" cy="35" r="17" fill="url(#headGrad)" />

        {/* Turban / headband */}
        <path
          d="M22 32 Q26 22 40 20 Q54 22 58 32"
          stroke="oklch(0.55 0.10 78)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="40" cy="20" r="3" fill="oklch(0.72 0.14 78)" />
        <circle cx="40" cy="20" r="1.5" fill="oklch(0.13 0.04 250)" />

        {/* Eyes */}
        <ellipse cx="33" cy="35" rx="3.5" ry="4" fill="oklch(0.13 0.04 250)" />
        <ellipse cx="47" cy="35" rx="3.5" ry="4" fill="oklch(0.13 0.04 250)" />
        {/* Glowing pupils */}
        <motion.ellipse
          cx="33"
          cy="35"
          rx="2"
          ry="2.5"
          fill="oklch(0.85 0.18 78)"
          animate={{ opacity: speaking ? [0.7, 1, 0.7] : 1 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.ellipse
          cx="47"
          cy="35"
          rx="2"
          ry="2.5"
          fill="oklch(0.85 0.18 78)"
          animate={{ opacity: speaking ? [0.7, 1, 0.7] : 1 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.1,
          }}
        />
        {/* Eye shine */}
        <circle cx="34" cy="33.5" r="0.7" fill="white" opacity="0.8" />
        <circle cx="48" cy="33.5" r="0.7" fill="white" opacity="0.8" />

        {/* Smile */}
        <path
          d="M34 42 Q40 47 46 42"
          stroke="oklch(0.13 0.04 250)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Nose */}
        <path
          d="M39 38 Q40 40 41 38"
          stroke="oklch(0.55 0.10 78)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />

        {/* Forehead bindi */}
        <circle cx="40" cy="28" r="1.5" fill="oklch(0.13 0.04 250)" />
        <circle cx="40" cy="28" r="0.8" fill="oklch(0.72 0.14 78)" />

        <defs>
          <radialGradient id="headGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="oklch(0.82 0.16 78)" />
            <stop offset="100%" stopColor="oklch(0.65 0.12 78)" />
          </radialGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

export function WelcomeSplash({
  onDismiss,
  userName = "",
}: WelcomeSplashProps) {
  const { t } = useTranslation();
  const [speaking, setSpeaking] = useState(false);
  // hasPlayed tracks whether user has tapped to hear the message
  const [hasPlayed, setHasPlayed] = useState(false);

  // Personalize speech text with user's name
  const personalizedSpeech = userName
    ? t.welcome_speech.replace(/\{name\}/g, userName)
    : t.welcome_speech.replace(/\{name\}[,!]?\s*/g, "");

  // Personalized greeting
  const personalizedGreeting = userName
    ? t.splash_greeting.replace(/\{name\}/g, userName)
    : "";

  const stopAudio = useCallback(() => {
    stopSpeech();
    setSpeaking(false);
  }, []);

  // Must be called directly from a user click event for browser to allow audio
  const speakMessage = useCallback(() => {
    setSpeaking(true);
    setHasPlayed(true);
    speakText(
      personalizedSpeech,
      t.welcome_speech_lang,
      () => setSpeaking(false),
      () => setSpeaking(false),
    );
  }, [personalizedSpeech, t.welcome_speech_lang]);

  const _toggleSpeak = () => {
    if (speaking) {
      stopAudio();
    } else {
      speakMessage();
    }
  };

  const handleDismiss = () => {
    stopAudio();
    onDismiss();
  };

  const speechLines = personalizedSpeech
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
            {/* AI Character */}
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                damping: 14,
                stiffness: 180,
                delay: 0.1,
              }}
            >
              <AICharacter speaking={speaking} />
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
              className="text-white/50 text-sm mb-3 font-display italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t.splash_tagline}
            </motion.p>

            {/* Personalized greeting */}
            {personalizedGreeting && (
              <motion.div
                className="mb-4 px-4 py-2 rounded-xl text-center"
                style={{
                  background: "oklch(0.72 0.14 78 / 0.15)",
                  border: "1px solid oklch(0.72 0.14 78 / 0.4)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: "oklch(0.85 0.18 78)" }}
                >
                  {personalizedGreeting}
                </span>
              </motion.div>
            )}

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

            {/* Tap-to-hear button - MUST be direct user click for browser audio policy */}
            {!speaking && (
              <motion.button
                type="button"
                data-ocid="splash.play_audio"
                onClick={speakMessage}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-bold mb-3 transition-all"
                style={{
                  background: "oklch(0.72 0.14 78 / 0.15)",
                  border: "2px solid oklch(0.72 0.14 78 / 0.7)",
                  color: "oklch(0.72 0.14 78)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Volume2 className="w-5 h-5" />
                {hasPlayed ? t.splash_unmute : `🔊 ${t.splash_mute}`}
              </motion.button>
            )}
            {speaking && (
              <motion.button
                type="button"
                data-ocid="splash.stop_audio"
                onClick={stopAudio}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-bold mb-3 transition-all"
                style={{
                  background: "oklch(0.72 0.14 78 / 0.25)",
                  border: "2px solid oklch(0.72 0.14 78)",
                  color: "oklch(0.72 0.14 78)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <VolumeX className="w-5 h-5" />
                {t.splash_mute}
              </motion.button>
            )}
            <motion.button
              type="button"
              data-ocid="splash.primary_button"
              onClick={handleDismiss}
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
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
