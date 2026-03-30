import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import type { ChatbotEntry } from "../backend.d";
import { VakyomLogo } from "../components/VakyomLogo";
import { useTranslation } from "../i18n/useTranslation";

const GOLD = "oklch(0.72 0.14 78)";
const NAVY_BG = "#0a0f1e";
const CARD_BG = "rgba(17,25,55,0.85)";
const BORDER = "rgba(212,175,55,0.25)";

const DISCLAIMERS: Record<string, string> = {
  "en-IN":
    "This is legal guidance, not legal advice. Please consult a qualified lawyer for your specific situation.",
  "hi-IN":
    "यह कानूनी मार्गदर्शन है, कानूनी सलाह नहीं। कृपया अपनी विशिष्ट स्थिति के लिए एक योग्य वकील से परामर्श लें।",
  "kn-IN":
    "ಇದು ಕಾನೂನು ಮಾರ್ಗದರ್ಶನ, ಕಾನೂನು ಸಲಹೆ ಅಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಪರಿಸ್ಥಿತಿಗಾಗಿ ಅರ್ಹ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
  "ta-IN":
    "இது சட்ட வழிகாட்டுதல், சட்ட ஆலோசனை அல்ல. உங்கள் குறிப்பிட்ட சூழ்நிலைக்கு தகுதிவாய்ந்த வழக்கறிஞரை அணுகவும்.",
  "te-IN":
    "ఇది చట్ట మార్గదర్శకం, చట్టపరమైన సలహా కాదు. దయచేసి మీ నిర్దిష్ట పరిస్థితి కోసం అర్హులైన న్యాయవాదిని సంప్రదించండి.",
  "bn-IN":
    "এটি আইনি নির্দেশিকা, আইনি পরামর্শ নয়। আপনার নির্দিষ্ট পরিস্থিতির জন্য একজন যোগ্য আইনজীবীর সাথে পরামর্শ করুন।",
};

type SpeechRecognitionEvent = {
  results: { [key: number]: { [key: number]: { transcript: string } } };
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

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

function matchEntry(
  query: string,
  entries: ChatbotEntry[],
): ChatbotEntry | null {
  if (!query.trim() || entries.length === 0) return null;
  const lower = query.toLowerCase();
  for (const entry of entries) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw.toLowerCase())) return entry;
    }
  }
  return null;
}

interface VoiceAssistantProps {
  onBack: () => void;
}

export function VoiceAssistant({ onBack }: VoiceAssistantProps) {
  const { t } = useTranslation();
  const { actor, isFetching } = useActor();
  const langCode = t.welcome_speech_lang;
  const disclaimer = DISCLAIMERS[langCode] ?? DISCLAIMERS["en-IN"];

  const [textInput, setTextInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [matchedEntry, setMatchedEntry] = useState<ChatbotEntry | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: entries = [], isLoading } = useQuery<ChatbotEntry[]>({
    queryKey: ["chatbotEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getChatbotEntries();
    },
    enabled: !!actor && !isFetching,
  });

  const stopCurrentSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const playChunks = (chunks: string[], index: number) => {
    if (index >= chunks.length) {
      setIsSpeaking(false);
      return;
    }
    const audio = new Audio(ttsUrl(chunks[index], langCode));
    audioRef.current = audio;
    audio.onended = () => playChunks(chunks, index + 1);
    audio.onerror = () => playChunks(chunks, index + 1);
    audio.play().catch(() => setIsSpeaking(false));
  };

  const speakEntry = (entry: ChatbotEntry) => {
    stopCurrentSpeech();
    const text = `${entry.intro}. ${entry.whatToDo}. ${entry.tip}`;
    const chunks = splitIntoChunks(text);
    setIsSpeaking(true);
    playChunks(chunks, 0);
  };

  const toggleSpeak = (entry: ChatbotEntry) => {
    if (isSpeaking) {
      stopCurrentSpeech();
    } else {
      speakEntry(entry);
    }
  };

  const processQuery = (query: string) => {
    stopCurrentSpeech();
    const found = matchEntry(query, entries);
    if (found) {
      setMatchedEntry(found);
      setNoMatch(false);
    } else {
      setMatchedEntry(null);
      setNoMatch(true);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    setTranscript(textInput);
    processQuery(textInput);
  };

  const handleTopicClick = (entry: ChatbotEntry) => {
    setTranscript(entry.title);
    setTextInput(entry.title);
    setMatchedEntry(entry);
    setNoMatch(false);
    stopCurrentSpeech();
  };

  const handleReset = () => {
    stopCurrentSpeech();
    setMatchedEntry(null);
    setNoMatch(false);
    setTranscript("");
    setTextInput("");
  };

  const startListening = () => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    const recognition = new SpeechRecognitionClass();
    recognition.lang = langCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setTextInput(result);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      if (recognitionRef.current) {
        const lastTranscript = textInput;
        if (lastTranscript) processQuery(lastTranscript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return (
    <div className="min-h-screen screen-enter" style={{ background: NAVY_BG }}>
      <header
        style={{
          background: "rgba(17,25,55,0.95)",
          borderBottom: `1px solid ${BORDER}`,
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          backdropFilter: "blur(10px)",
        }}
      >
        <button
          type="button"
          data-ocid="voice_assistant.back.button"
          onClick={() => {
            stopCurrentSpeech();
            onBack();
          }}
          style={{
            color: "rgba(255,255,255,0.6)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <VakyomLogo size={36} />
        <span
          className="font-display font-bold"
          style={{ color: GOLD, fontSize: "1.1rem" }}
        >
          {t.talk_to_vakyom}
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Search bar */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Input
              data-ocid="voice_assistant.search_input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
              placeholder="Describe your legal problem..."
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${BORDER}`,
                color: "white",
                borderRadius: "12px",
                padding: "0.75rem 1rem",
              }}
            />
          </div>
          <Button
            data-ocid="voice_assistant.submit_button"
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            style={{
              background: "rgba(212,175,55,0.9)",
              color: "#0a0f1e",
              border: "none",
              borderRadius: "12px",
              padding: "0 1rem",
              fontWeight: 700,
            }}
          >
            <Send size={16} />
          </Button>
          <button
            type="button"
            data-ocid="voice_assistant.mic.toggle"
            onClick={isListening ? stopListening : startListening}
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: isListening
                ? "rgba(239,68,68,0.2)"
                : "rgba(212,175,55,0.15)",
              border: `1px solid ${isListening ? "rgba(239,68,68,0.5)" : BORDER}`,
              color: isListening ? "#f87171" : GOLD,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>

        {/* Transcript indicator */}
        {transcript && (
          <div
            style={{
              background: "rgba(212,175,55,0.08)",
              border: `1px solid ${BORDER}`,
              borderRadius: "10px",
              padding: "0.5rem 1rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.85rem",
                fontStyle: "italic",
              }}
            >
              &ldquo;{transcript}&rdquo;
            </span>
            <button
              type="button"
              data-ocid="voice_assistant.reset.button"
              onClick={handleReset}
              style={{
                color: "rgba(255,255,255,0.35)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div
            data-ocid="voice_assistant.loading_state"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                style={{
                  height: "64px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                }}
              />
            ))}
          </div>
        )}

        {/* Topic quick-buttons */}
        {!isLoading && !matchedEntry && !noMatch && entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
                fontWeight: 600,
              }}
            >
              Browse Topics
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {entries.map((entry, i) => (
                <button
                  key={entry.topicKey}
                  type="button"
                  data-ocid={`voice_assistant.topic.item.${i + 1}`}
                  onClick={() => handleTopicClick(entry)}
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    borderRadius: "9999px",
                    padding: "0.4rem 0.9rem",
                    color: "rgba(212,175,55,0.9)",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontWeight: 500,
                    transition: "background 0.2s",
                  }}
                >
                  <span>{entry.icon}</span>
                  <span>{entry.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Matched result card */}
        <AnimatePresence mode="wait">
          {matchedEntry && (
            <motion.div
              key={matchedEntry.topicKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              data-ocid="voice_assistant.result.card"
              style={{
                background: CARD_BG,
                border: "1px solid rgba(212,175,55,0.3)",
                borderRadius: "18px",
                padding: "1.5rem",
                marginTop: "1.5rem",
                boxShadow: "0 4px 32px rgba(212,175,55,0.08)",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <span style={{ fontSize: "1.6rem" }}>
                    {matchedEntry.icon}
                  </span>
                  <h2
                    style={{
                      color: GOLD,
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      margin: 0,
                    }}
                  >
                    {matchedEntry.title}
                  </h2>
                </div>
                <button
                  type="button"
                  data-ocid="voice_assistant.speak.toggle"
                  onClick={() => toggleSpeak(matchedEntry)}
                  style={{
                    background: isSpeaking
                      ? "rgba(212,175,55,0.2)"
                      : "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: "8px",
                    padding: "0.4rem 0.7rem",
                    color: GOLD,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                  }}
                >
                  {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  {isSpeaking ? "Stop" : "🔊 Hear"}
                </button>
              </div>

              {/* Intro */}
              <p
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  marginBottom: "1.25rem",
                }}
              >
                {matchedEntry.intro}
              </p>

              {/* What to do */}
              <div
                style={{
                  background: "rgba(212,175,55,0.07)",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderRadius: "12px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    color: GOLD,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  👉 What to do
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {matchedEntry.whatToDo}
                </p>
              </div>

              {/* Documents */}
              {matchedEntry.documents.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    📄 Documents needed
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "1.2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.2rem",
                    }}
                  >
                    {matchedEntry.documents.map((doc) => (
                      <li
                        key={doc}
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.6rem",
                  marginBottom: "1rem",
                }}
              >
                {[
                  {
                    icon: "👨‍⚖️",
                    label: "Lawyer type",
                    val: matchedEntry.lawyerType,
                  },
                  { icon: "💰", label: "Cost", val: matchedEntry.cost },
                  { icon: "⏳", label: "Time", val: matchedEntry.timeRequired },
                  {
                    icon: "📊",
                    label: "Success rate",
                    val: matchedEntry.successRate,
                  },
                ].map(({ icon, label, val }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: "10px",
                      padding: "0.6rem 0.8rem",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {icon} {label}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "0.84rem",
                        margin: 0,
                      }}
                    >
                      {val}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    color: "rgba(134,239,172,0.9)",
                    fontSize: "0.85rem",
                    margin: 0,
                  }}
                >
                  💡 <strong>Tip:</strong> {matchedEntry.tip}
                </p>
              </div>

              {/* Disclaimer */}
              <div
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    color: "rgba(252,165,165,0.85)",
                    fontSize: "0.8rem",
                    margin: 0,
                  }}
                >
                  ⚠️ {disclaimer}
                </p>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/918152889991"
                target="_blank"
                rel="noreferrer"
                data-ocid="voice_assistant.whatsapp.button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: "#25D366",
                  color: "white",
                  borderRadius: "12px",
                  padding: "0.75rem",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                <MessageCircle size={18} /> Connect with a Real Lawyer on
                WhatsApp
              </a>
            </motion.div>
          )}

          {/* No match fallback */}
          {noMatch && (
            <motion.div
              key="no-match"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              data-ocid="voice_assistant.no_match.card"
              style={{
                background: CARD_BG,
                border: "1px dashed rgba(212,175,55,0.25)",
                borderRadius: "18px",
                padding: "2rem",
                marginTop: "1.5rem",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "1rem",
                  lineHeight: 1.6,
                }}
              >
                We couldn&apos;t find a direct answer. Please describe your
                problem on WhatsApp and our legal team will help you.
              </p>
              <a
                href="https://wa.me/918152889991"
                target="_blank"
                rel="noreferrer"
                data-ocid="voice_assistant.whatsapp_fallback.button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#25D366",
                  color: "white",
                  borderRadius: "12px",
                  padding: "0.7rem 1.5rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Topic quick-buttons at bottom after result */}
        {matchedEntry && entries.length > 1 && (
          <div style={{ marginTop: "1.5rem" }}>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6rem",
              }}
            >
              Other Topics
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {entries
                .filter((e) => e.topicKey !== matchedEntry.topicKey)
                .map((entry, i) => (
                  <button
                    key={entry.topicKey}
                    type="button"
                    data-ocid={`voice_assistant.other_topic.item.${i + 1}`}
                    onClick={() => handleTopicClick(entry)}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "9999px",
                      padding: "0.3rem 0.8rem",
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <span>{entry.icon}</span>
                    <span>{entry.title}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
