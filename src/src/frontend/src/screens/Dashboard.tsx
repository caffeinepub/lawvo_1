import {
  Briefcase,
  FileText,
  Info,
  MessageCircle,
  Mic,
  Scale,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { VakyomLogo } from "../components/VakyomLogo";
import { useTranslation } from "../i18n/useTranslation";

export type DashboardScreen =
  | "voice"
  | "document"
  | "guidance"
  | "lawyers"
  | "cases"
  | "about";

interface DashboardProps {
  onNavigate: (screen: DashboardScreen) => void;
}

const WHATSAPP_BASE = "https://wa.me/918152889991";

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

function ttsUrl(text: string, lang: string): string {
  const langCode = lang.split("-")[0];
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${langCode}&client=tw-ob`;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { t } = useTranslation();
  const [showFounderModal, setShowFounderModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DashboardScreen | null>(
    null,
  );
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<string[]>([]);
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
      audio.onended = () => playChunk(index + 1);
      audio.onerror = () => setSpeaking(false);
      audio.play().catch(() => setSpeaking(false));
    },
    [t.welcome_speech_lang],
  );

  const speakMessage = useCallback(() => {
    if (mutedRef.current) return;
    stopAudio();
    stoppedRef.current = false;
    chunksRef.current = splitIntoChunks(t.founder_modal_message);
    playChunk(0);
  }, [t.founder_modal_message, stopAudio, playChunk]);

  // Auto-play when modal opens
  useEffect(() => {
    if (showFounderModal) {
      const timer = setTimeout(speakMessage, 600);
      return () => clearTimeout(timer);
    }
    stopAudio();
  }, [showFounderModal, speakMessage, stopAudio]);

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

  const CARDS: {
    id: DashboardScreen;
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
  }[] = [
    {
      id: "voice",
      icon: Mic,
      title: t.talk_to_vakyom,
      description: t.talk_to_vakyom_desc,
      color: "oklch(0.72 0.14 78)",
    },
    {
      id: "document",
      icon: FileText,
      title: t.upload_document,
      description: t.upload_document_desc,
      color: "oklch(0.60 0.15 250)",
    },
    {
      id: "guidance",
      icon: Scale,
      title: t.legal_guidance,
      description: t.legal_guidance_desc,
      color: "oklch(0.60 0.16 145)",
    },
    {
      id: "lawyers",
      icon: Users,
      title: t.find_lawyer,
      description: t.find_lawyer_desc,
      color: "oklch(0.65 0.14 30)",
    },
    {
      id: "cases",
      icon: Briefcase,
      title: t.my_cases,
      description: t.my_cases_desc,
      color: "oklch(0.60 0.18 310)",
    },
    {
      id: "about",
      icon: Info,
      title: t.about_vakyom,
      description: t.about_vakyom_desc,
      color: "oklch(0.65 0.06 250)",
    },
  ];

  const handleCardClick = (id: DashboardScreen) => {
    if (id === "about") {
      onNavigate(id);
    } else {
      setSelectedCard(id);
      setShowFounderModal(true);
    }
  };

  const handleCloseModal = () => {
    stopAudio();
    setShowFounderModal(false);
    setSelectedCard(null);
  };

  const handleStartWhatsApp = () => {
    stopAudio();
    setShowFounderModal(false);

    const whatsappMessages: Record<string, string> = {
      voice: `Hello! I am contacting from Vakyom. My preferred language is: ${t.language_label}. I need help with: Voice / AI Legal Assistant. Please assist me.`,
      document: `Hello! I am contacting from Vakyom. My preferred language is: ${t.language_label}. I need help with: Document Analysis. Please assist me.`,
      guidance: `Hello! I am contacting from Vakyom. My preferred language is: ${t.language_label}. I need help with: Legal Guidance. Please assist me.`,
      lawyers: `Hello! I am contacting from Vakyom. My preferred language is: ${t.language_label}. I need help with: Finding a Lawyer. Please assist me.`,
      cases: `Hello! I am contacting from Vakyom. My preferred language is: ${t.language_label}. I need help with: My Case Status. Please assist me.`,
    };

    const message = selectedCard ? whatsappMessages[selectedCard] : null;
    const url = message
      ? `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`
      : WHATSAPP_BASE;

    setSelectedCard(null);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const founderLines = t.founder_modal_message
    .split("\n\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="min-h-screen bg-background screen-enter">
      {/* Header */}
      <header className="bg-navy px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <VakyomLogo size={36} />
          <span className="font-display font-bold text-gold text-xl">
            Vakyom
          </span>
        </div>
        <div className="bg-gold/20 text-gold text-xs font-semibold px-3 py-1 rounded-full border border-gold/30">
          {t.language_label}
        </div>
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            {t.dashboard_title}
          </h1>
          <p className="text-muted-foreground mb-8">{t.dashboard_subtitle}</p>

          <div className="grid grid-cols-2 gap-4">
            {CARDS.map((card, i) => (
              <motion.button
                key={card.id}
                data-ocid={`dashboard.card.item.${i + 1}`}
                onClick={() => handleCardClick(card.id)}
                className="group p-5 rounded-2xl bg-card border border-border hover:border-transparent text-left transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    backgroundColor: `${card.color.replace(")", " / 0.15)")}`,
                  }}
                >
                  <card.icon
                    className="w-6 h-6"
                    style={{ color: card.color }}
                  />
                </div>
                <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-snug">
                  {card.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Founder Message Modal */}
      <AnimatePresence>
        {showFounderModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(5, 10, 30, 0.92)" }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-3xl overflow-hidden"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 240 }}
              style={{
                background: "oklch(0.13 0.04 250)",
                border: "2px solid oklch(0.72 0.14 78 / 0.5)",
                boxShadow: "0 0 60px oklch(0.72 0.14 78 / 0.3)",
              }}
            >
              {/* Gold bar top */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.72 0.14 78), transparent)",
                }}
              />

              <div className="p-7">
                {/* Header row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="rounded-xl p-2"
                      style={{ background: "white" }}
                      animate={
                        speaking ? { scale: [1, 1.08, 1] } : { scale: 1 }
                      }
                      transition={
                        speaking
                          ? { duration: 1.2, repeat: Number.POSITIVE_INFINITY }
                          : {}
                      }
                    >
                      <VakyomLogo size={32} />
                    </motion.div>
                    <div>
                      <p
                        className="font-bold text-sm"
                        style={{ color: "oklch(0.72 0.14 78)" }}
                      >
                        Tarun Kumar
                      </p>
                      <p className="text-xs text-white/50">Founder, Vakyom</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-white/40 hover:text-white/80 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sound wave indicator */}
                {speaking && (
                  <motion.div
                    className="flex items-center gap-1 mb-4"
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

                {/* Message */}
                <div
                  className="rounded-2xl p-5 mb-6 space-y-3"
                  style={{
                    background: "oklch(0.18 0.05 250)",
                    border: "1px solid oklch(0.72 0.14 78 / 0.2)",
                  }}
                >
                  {founderLines.map((line, i) => (
                    <p
                      // biome-ignore lint/suspicious/noArrayIndexKey: static list
                      key={i}
                      className="text-sm leading-relaxed"
                      style={{
                        color:
                          i === 0
                            ? "oklch(0.72 0.14 78)"
                            : "rgba(255,255,255,0.82)",
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
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
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: "oklch(0.18 0.05 250)",
                      border: "1px solid oklch(0.72 0.14 78 / 0.3)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {t.founder_modal_close}
                  </button>
                  <motion.button
                    type="button"
                    data-ocid="dashboard.whatsapp.primary_button"
                    onClick={handleStartWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ background: "#25D366", color: "white" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t.founder_modal_start}
                  </motion.button>
                </div>
              </div>

              {/* Gold bar bottom */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.72 0.14 78), transparent)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
