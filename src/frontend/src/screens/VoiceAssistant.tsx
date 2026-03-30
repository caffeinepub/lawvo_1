import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const FALLBACK_ENTRIES: ChatbotEntry[] = [
  {
    id: 1n,
    topicKey: "land_dispute",
    icon: "🏞️",
    title: "Land Dispute / Ownership",
    keywords: [
      "land",
      "property",
      "ownership",
      "dispute",
      "plot",
      "deed",
      "title",
      "encumbrance",
    ],
    intro:
      "This usually happens when two people claim the same land or ownership is unclear. This is very common in India.",
    whatToDo:
      "Start by checking your property documents and then file a case in the civil court for ownership declaration.",
    documents: [
      "Sale deed / Title deed",
      "Encumbrance certificate",
      "Property tax receipts",
      "Any agreement papers",
    ],
    lawyerType: "Civil / Property Lawyer",
    cost: "₹20,000 – ₹2,00,000+",
    timeRequired: "2–10 years",
    successRate: "Good if documents are clear",
    tip: "Always verify land records before buying to avoid future disputes.",
  },
  {
    id: 2n,
    topicKey: "fir_police",
    icon: "👮",
    title: "Police Not Filing FIR",
    keywords: [
      "fir",
      "police",
      "complaint",
      "station",
      "report",
      "filing",
      "refuse",
      "refused",
    ],
    intro:
      "If police refuse to file your FIR, it is your legal right to escalate.",
    whatToDo:
      "Go to the Superintendent of Police (SP), or file a complaint before the Magistrate under Section 156(3) CrPC.",
    documents: [
      "Written complaint",
      "Proof (photos, messages, etc.)",
      "ID proof",
    ],
    lawyerType: "Criminal Lawyer",
    cost: "₹5,000 – ₹50,000",
    timeRequired: "Few days to a few weeks",
    successRate: "Very high",
    tip: "You can also file an FIR online in many states via the state police portal.",
  },
  {
    id: 3n,
    topicKey: "bail",
    icon: "⚖️",
    title: "Bail Process",
    keywords: [
      "bail",
      "custody",
      "arrest",
      "arrested",
      "jail",
      "release",
      "interim",
      "anticipatory",
    ],
    intro:
      "Bail means temporary release from custody. It is not freedom from the case.",
    whatToDo:
      "Hire a criminal lawyer immediately and apply for bail in the nearest court.",
    documents: ["FIR copy", "ID proof", "Surety documents"],
    lawyerType: "Criminal Lawyer",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "1 day to a few weeks",
    successRate: "High for minor offences",
    tip: "Cooperating with the investigation increases your chances of getting bail.",
  },
  {
    id: 4n,
    topicKey: "divorce",
    icon: "👩‍⚖️",
    title: "Divorce Procedure",
    keywords: [
      "divorce",
      "separation",
      "marriage",
      "wife",
      "husband",
      "mutual",
      "contested",
      "family court",
      "alimony",
      "file a divorce",
      "want divorce",
      "getting divorce",
    ],
    intro:
      "Divorce can be mutual (faster) or contested (longer). Mutual divorce saves time and reduces stress.",
    whatToDo:
      "File a divorce petition in the family court. Hiring a family lawyer is strongly recommended.",
    documents: [
      "Marriage certificate",
      "Address proof",
      "Evidence (if contested)",
      "Income details",
    ],
    lawyerType: "Family Lawyer",
    cost: "₹20,000 – ₹2,00,000",
    timeRequired: "Mutual: 6 months–1 year | Contested: 2–5 years",
    successRate: "Very high if legally valid grounds exist",
    tip: "Mutual divorce is always smoother, cheaper, and less emotionally draining.",
  },
  {
    id: 5n,
    topicKey: "domestic_violence",
    icon: "🛡️",
    title: "Domestic Violence",
    keywords: [
      "domestic",
      "violence",
      "abuse",
      "harassment",
      "beating",
      "threat",
      "dowry",
    ],
    intro:
      "You are legally protected. Physical, emotional, and financial abuse are all punishable under Indian law.",
    whatToDo:
      "File a complaint under the Protection of Women from Domestic Violence Act or approach the nearest police women's cell.",
    documents: [
      "Medical reports (if any)",
      "Messages / evidence",
      "Witness details",
    ],
    lawyerType: "Family / Criminal Lawyer",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "Immediate protection orders are possible",
    successRate: "High if evidence exists",
    tip: "You can get protection orders, residence rights, and maintenance through the court.",
  },
  {
    id: 6n,
    topicKey: "salary",
    icon: "💼",
    title: "Salary Not Paid",
    keywords: [
      "salary",
      "wages",
      "payment",
      "employer",
      "company",
      "job",
      "work",
      "labour",
      "fired",
      "terminated",
    ],
    intro: "Employers cannot legally withhold your salary.",
    whatToDo:
      "File a complaint with the Labour Commissioner or approach the Labour Court.",
    documents: ["Offer letter", "Salary slips", "Bank statements"],
    lawyerType: "Labour Lawyer",
    cost: "₹5,000 – ₹50,000",
    timeRequired: "2–6 months",
    successRate: "Very high",
    tip: "Always keep all employment documents safely.",
  },
  {
    id: 7n,
    topicKey: "cheque_bounce",
    icon: "🏦",
    title: "Cheque Bounce",
    keywords: [
      "cheque",
      "check",
      "bounce",
      "dishonour",
      "neft",
      "rtgs",
      "loan",
    ],
    intro:
      "A bounced cheque is a criminal offence under Section 138 of the Negotiable Instruments Act.",
    whatToDo:
      "Send a legal notice to the defaulter within 30 days of receiving the bank memo, then file a case.",
    documents: ["Bounced cheque", "Bank memo", "Legal notice copy"],
    lawyerType: "Criminal / Civil Lawyer",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "6 months – 2 years",
    successRate: "High if all documents are in order",
    tip: "Always keep proof of every financial transaction.",
  },
  {
    id: 8n,
    topicKey: "consumer",
    icon: "🛍️",
    title: "Consumer / Defective Product",
    keywords: [
      "consumer",
      "product",
      "defective",
      "refund",
      "service",
      "fraud",
      "cheated",
      "amazon",
      "flipkart",
    ],
    intro:
      "If you received a bad product or poor service, you can claim a full refund or compensation.",
    whatToDo:
      "File a complaint in consumer court. You can also file online at edaakhil.nic.in.",
    documents: ["Bill / Invoice", "Warranty card", "Complaint proof"],
    lawyerType: "Consumer Lawyer (optional)",
    cost: "₹1,000 – ₹20,000",
    timeRequired: "3–12 months",
    successRate: "High",
    tip: "For small claims below ₹50 lakh, you do not need a lawyer in consumer court.",
  },
  {
    id: 9n,
    topicKey: "cyber_fraud",
    icon: "🌐",
    title: "Online Fraud / Cyber Crime",
    keywords: [
      "cyber",
      "online",
      "fraud",
      "scam",
      "hack",
      "otp",
      "upi",
      "phishing",
      "money",
      "stolen",
      "internet",
    ],
    intro:
      "If money was stolen online, act FAST. Time is critical for recovery.",
    whatToDo:
      "Immediately call the cyber helpline 1930, then report online at cybercrime.gov.in.",
    documents: [
      "Transaction details",
      "Screenshots of fraud",
      "Bank account information",
    ],
    lawyerType: "Cyber Lawyer (optional)",
    cost: "Mostly free to file a complaint",
    timeRequired: "Immediate action needed",
    successRate: "Medium (depends on how quickly you report)",
    tip: "Report within hours of the fraud for the best chance of recovering your money.",
  },
  {
    id: 10n,
    topicKey: "builder_rera",
    icon: "🏠",
    title: "Builder Not Giving Possession",
    keywords: [
      "builder",
      "possession",
      "flat",
      "apartment",
      "rera",
      "construction",
      "delay",
      "project",
      "housing",
      "developer",
    ],
    intro:
      "Builder delays are common in India, but the law strongly protects buyers under RERA.",
    whatToDo:
      "File a complaint in the RERA authority of your state or approach the consumer court.",
    documents: ["Sale agreement", "Payment receipts", "Builder communication"],
    lawyerType: "Property Lawyer",
    cost: "₹10,000 – ₹1,00,000",
    timeRequired: "6 months – 3 years",
    successRate: "High in RERA",
    tip: "RERA is specifically designed for such disputes and is much faster than civil courts.",
  },
  {
    id: 11n,
    topicKey: "fundamental_rights",
    icon: "⚖️",
    title: "Rights Violation by Authority",
    keywords: [
      "rights",
      "fundamental",
      "authority",
      "government",
      "violation",
      "constitutional",
      "writ",
      "high court",
      "supreme court",
    ],
    intro:
      "If your basic constitutional rights are violated by any authority, you can directly approach the High Court or Supreme Court.",
    whatToDo:
      "File a writ petition in the High Court (Article 226) or Supreme Court (Article 32) of India.",
    documents: [
      "Proof of rights violation",
      "Identity proof",
      "Supporting evidence",
    ],
    lawyerType: "Constitutional Lawyer",
    cost: "₹20,000 – ₹2,00,000+",
    timeRequired: "A few weeks to several months",
    successRate: "Depends on strength of evidence",
    tip: "Courts take rights violations very seriously. Document everything carefully.",
  },
];

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

  const { data: entries = [], isLoading } = useQuery<ChatbotEntry[]>({
    queryKey: ["chatbotEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getChatbotEntries();
    },
    enabled: !!actor && !isFetching,
  });

  const activeEntries = entries.length > 0 ? entries : FALLBACK_ENTRIES;

  const stopCurrentSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakEntry = (entry: ChatbotEntry) => {
    stopCurrentSpeech();
    const text = `${entry.intro}. ${entry.whatToDo}. ${entry.tip}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 1.1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
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
    const found = matchEntry(query, activeEntries);
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

        {/* Loading state — only show while backend hasn't loaded AND fallback topics are being used */}
        {isLoading && entries.length === 0 && (
          <div
            data-ocid="voice_assistant.loading_state"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.8rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Syncing latest responses...
          </div>
        )}

        {/* Topic quick-buttons */}
        {!matchedEntry && !noMatch && activeEntries.length > 0 && (
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
              {activeEntries.map((entry, i) => (
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
        {matchedEntry && activeEntries.length > 1 && (
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
              {activeEntries
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
