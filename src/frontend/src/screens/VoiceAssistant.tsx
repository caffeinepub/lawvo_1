import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Loader2,
  Mic,
  MicOff,
  Scale,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { VakyomLogo } from "../components/VakyomLogo";
import { useTranslation } from "../i18n/useTranslation";

const SIMULATED_RESPONSE_BY_LANG: Record<string, string> = {
  "en-IN": `Based on your situation, here is what you should do:

Immediate Steps - Within 7 Days: Do not ignore the notice, responding is legally required in most cases. Read the notice carefully to identify the sender, the legal claim, and the deadline to respond.

Within 30 Days: Gather all property-related documents including title deed, sale agreement, tax receipts, and mutation records. Consult a property lawyer to understand the legal implications and draft a proper response.

Important Points: A legal notice is a formal communication. Ignoring it may result in court proceedings against you. Your response can significantly impact future legal proceedings.

Recommended Action: Consult a qualified property lawyer within 2 weeks. Vakyom can connect you with verified property law experts in your city.

Disclaimer: This is general legal information, not legal advice.`,
  "hi-IN": `आपकी स्थिति के आधार पर, यहां बताया गया है कि आपको क्या करना चाहिए:

तुरंत कदम, 7 दिनों के भीतर: नोटिस को नजरअंदाज न करें, अधिकांश मामलों में जवाब देना कानूनी रूप से आवश्यक है। नोटिस को ध्यान से पढ़ें और प्रेषक, कानूनी दावे और जवाब देने की समय-सीमा की पहचान करें।

30 दिनों के भीतर: सभी संपत्ति-संबंधित दस्तावेज इकट्ठा करें। कानूनी निहितार्थों को समझने के लिए एक संपत्ति वकील से परामर्श करें।

अनुशंसित कार्रवाई: 2 सप्ताह के भीतर एक योग्य संपत्ति वकील से परामर्श करें। Vakyom आपके शहर में सत्यापित विशेषज्ञों से आपको जोड़ सकता है।`,
  "kn-IN": `ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯ ಆಧಾರದ ಮೇಲೆ, ನೀವು ಏನು ಮಾಡಬೇಕು ಎಂಬುದು ಇಲ್ಲಿದೆ:

ತಕ್ಷಣದ ಹಂತಗಳು, 7 ದಿನಗಳಲ್ಲಿ: ನೋಟಿಸ್ ಅನ್ನು ನಿರ್ಲಕ್ಷಿಸಬೇಡಿ, ಹೆಚ್ಚಿನ ಪ್ರಕರಣಗಳಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯಿಸುವುದು ಕಾನೂನುಬದ್ಧವಾಗಿ ಅಗತ್ಯ. ನೋಟಿಸ್ ಅನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ ಮತ್ತು ಕಳುಹಿಸಿದವರ ಹೆಸರು, ಕಾನೂನು ಹಕ್ಕು ಮತ್ತು ಗಡುವಿನ ದಿನಾಂಕ ಗುರುತಿಸಿ.

30 ದಿನಗಳಲ್ಲಿ: ಎಲ್ಲಾ ಆಸ್ತಿ ಸಂಬಂಧಿತ ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ. ಕಾನೂನು ಪರಿಣಾಮಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಆಸ್ತಿ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.

ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ: 2 ವಾರಗಳಲ್ಲಿ ಅರ್ಹ ಆಸ್ತಿ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ. Vakyom ನಿಮ್ಮ ನಗರದಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾದ ತಜ್ಞರೊಂದಿಗೆ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು.`,
  "ta-IN": `உங்கள் நிலைமையின் அடிப்படையில், நீங்கள் என்ன செய்ய வேண்டும் என்பது இங்கே:

உடனடி நடவடிக்கைகள், 7 நாட்களுக்குள்: நோட்டீஸை புறக்கணிக்காதீர்கள், பெரும்பாலான வழக்குகளில் பதிலளிப்பது சட்டப்படி அவசியம். நோட்டீஸை கவனமாக படியுங்கள் மற்றும் அனுப்புநர், சட்ட கோரிக்கை மற்றும் காலக்கெடுவை கண்டறியுங்கள்.

30 நாட்களுக்குள்: அனைத்து சொத்து தொடர்பான ஆவணங்களை சேகரியுங்கள். ஒரு சொத்து வழக்கறிஞரை அணுகுங்கள்.

பரிந்துரைக்கப்பட்ட நடவடிக்கை: 2 வாரங்களுக்குள் தகுதிவாய்ந்த சொத்து வழக்கறிஞரை அணுகுங்கள். Vakyom உங்கள் நகரில் சரிபார்க்கப்பட்ட வல்லுநர்களுடன் உங்களை இணைக்கலாம்.`,
  "te-IN": `మీ పరిస్థితి ఆధారంగా, మీరు ఏమి చేయాలో ఇక్కడ ఉంది:

తక్షణ చర్యలు, 7 రోజులలోపు: నోటీసును నిర్లక్ష్యం చేయవద్దు, చాలా సందర్భాలలో స్పందించడం చట్టపరంగా అవసరం. నోటీసును జాగ్రత్తగా చదవండి మరియు పంపిన వ్యక్తి, చట్టపరమైన వాదన మరియు గడువు తేదీని గుర్తించండి.

30 రోజులలోపు: అన్ని ఆస్తి సంబంధిత పత్రాలను సేకరించండి. చట్టపరమైన చిక్కులను అర్థం చేసుకోవడానికి ఆస్తి న్యాయవాదిని సంప్రదించండి.

సిఫార్సు చేయబడిన చర్య: 2 వారాలలోపు అర్హులైన ఆస్తి న్యాయవాదిని సంప్రదించండి. Vakyom మీ నగరంలో ధృవీకరించబడిన నిపుణులతో మిమ్మల్ని అనుసంధానించగలదు.`,
  "bn-IN": `আপনার পরিস্থিতির উপর ভিত্তি করে, আপনার কী করা উচিত তা এখানে:

তাৎক্ষণিক পদক্ষেপ, ৭ দিনের মধ্যে: নোটিশ উপেক্ষা করবেন না, বেশিরভাগ ক্ষেত্রে সাড়া দেওয়া আইনগতভাবে প্রয়োজনীয়। নোটিশটি সাবধানে পড়ুন এবং প্রেরক, আইনি দাবি এবং জবাব দেওয়ার সময়সীমা চিহ্নিত করুন।

৩০ দিনের মধ্যে: সমস্ত সম্পত্তি সংক্রান্ত নথি সংগ্রহ করুন। আইনি প্রভাব বুঝতে একজন সম্পত্তি আইনজীবীর সাথে পরামর্শ করুন।

প্রস্তাবিত পদক্ষেপ: ২ সপ্তাহের মধ্যে একজন যোগ্য সম্পত্তি আইনজীবীর সাথে পরামর্শ করুন। Vakyom আপনার শহরে যাচাইকৃত বিশেষজ্ঞদের সাথে আপনাকে সংযুক্ত করতে পারে।`,
};

interface VoiceAssistantProps {
  onBack: () => void;
}

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

// ---- Google Translate TTS helper ----
function chunkText(text: string, maxLen = 200): string[] {
  const sentences = text.split(/(?<=[।.!?\n])/);
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.filter(Boolean);
}

function speakWithGoogleTTS(
  text: string,
  langCode: string,
  onDone?: () => void,
): () => void {
  const lang = langCode.split("-")[0];
  const chunks = chunkText(text, 200);
  let stopped = false;
  let currentAudio: HTMLAudioElement | null = null;

  const playChunk = (index: number) => {
    if (stopped || index >= chunks.length) {
      onDone?.();
      return;
    }
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunks[index])}&tl=${lang}&client=tw-ob`;
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => playChunk(index + 1);
    audio.onerror = () => playChunk(index + 1);
    audio.play().catch(() => playChunk(index + 1));
  };

  playChunk(0);

  return () => {
    stopped = true;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
      currentAudio = null;
    }
  };
}
// ------------------------------------

export function VoiceAssistant({ onBack }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const stopSpeechRef = useRef<(() => void) | null>(null);
  const { t } = useTranslation();

  const langCode = t.welcome_speech_lang; // e.g. "kn-IN", "hi-IN"
  const simulatedResponse =
    SIMULATED_RESPONSE_BY_LANG[langCode] || SIMULATED_RESPONSE_BY_LANG["en-IN"];

  // Auto-speak when response appears
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only depends on showResponse
  useEffect(() => {
    if (showResponse && !isMuted) {
      setIsSpeaking(true);
      const stop = speakWithGoogleTTS(simulatedResponse, langCode, () => {
        setIsSpeaking(false);
      });
      stopSpeechRef.current = stop;
      return () => {
        stop();
      };
    }
  }, [showResponse]);

  const stopCurrentSpeech = () => {
    stopSpeechRef.current?.();
    stopSpeechRef.current = null;
    setIsSpeaking(false);
  };

  const toggleMute = () => {
    if (isSpeaking) {
      stopCurrentSpeech();
      setIsMuted(true);
    } else {
      setIsMuted(false);
      setIsSpeaking(true);
      const stop = speakWithGoogleTTS(simulatedResponse, langCode, () => {
        setIsSpeaking(false);
      });
      stopSpeechRef.current = stop;
    }
  };

  const startListening = () => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setShowResponse(true);
        }, 1800);
      }, 2500);
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = langCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setTextInput(result);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setIsLoading(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowResponse(true);
      }, 1500);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleMicClick = () => {
    if (showResponse) {
      stopCurrentSpeech();
      setShowResponse(false);
      setTranscript("");
      setTextInput("");
      setIsMuted(false);
      return;
    }
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResponse(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background screen-enter">
      <header className="bg-navy px-6 py-4 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <VakyomLogo size={36} />
        <span className="font-display font-bold text-gold text-xl">
          {t.talk_to_vakyom}
        </span>
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        {/* Language indicator */}
        <div className="mb-6 p-3 rounded-xl bg-muted border border-border flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            {t.language_label}
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: "oklch(0.72 0.14 78)" }}
          >
            {langCode}
          </span>
        </div>

        {/* Transcript display */}
        {transcript ? (
          <div className="mb-6 p-4 rounded-xl bg-muted border border-border">
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
              {"You said:"}
            </p>
            <p className="text-sm text-foreground italic">
              &quot;{transcript}&quot;
            </p>
          </div>
        ) : (
          <div className="mb-8 p-4 rounded-xl bg-muted border border-border">
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
              {t.voice_example_query_label}
            </p>
            <p className="text-sm text-foreground italic">
              &quot;I received a legal notice regarding property. What should I
              do?&quot;
            </p>
          </div>
        )}

        {/* Mic button */}
        <div className="flex flex-col items-center py-8">
          <div className="relative">
            <AnimatePresence>
              {isListening && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-gold"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-gold"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.7, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.5,
                    }}
                  />
                </>
              )}
            </AnimatePresence>

            <motion.button
              data-ocid="voice.canvas_target"
              onClick={handleMicClick}
              className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isListening
                  ? "bg-gold shadow-gold"
                  : "bg-navy hover:bg-navy-mid"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <Mic className="w-12 h-12 text-navy" />
              ) : (
                <MicOff className="w-12 h-12 text-gold" />
              )}
            </motion.button>
          </div>

          <p className="mt-6 text-sm font-medium text-muted-foreground">
            {isListening
              ? t.voice_listening
              : isLoading
                ? t.voice_processing
                : showResponse
                  ? t.voice_tap_again
                  : t.voice_tap}
          </p>

          {isLoading && (
            <Loader2 className="mt-4 w-6 h-6 text-gold animate-spin" />
          )}
        </div>

        {/* AI Response */}
        <AnimatePresence>
          {showResponse && (
            <motion.div
              className="mb-6 p-6 rounded-xl bg-navy text-white border border-gold/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-gold" />
                  <span className="text-gold font-semibold text-sm">
                    {t.voice_response_title}
                  </span>
                </div>
                <button
                  data-ocid="voice.toggle"
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  title={isSpeaking ? "Mute" : "Speak"}
                >
                  {isSpeaking ? (
                    <Volume2 className="w-4 h-4 text-gold" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gold/50" />
                  )}
                </button>
              </div>
              <div className="text-sm text-white/85 leading-relaxed whitespace-pre-line">
                {simulatedResponse}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text input alternative */}
        <div className="flex gap-2 mt-4">
          <Input
            data-ocid="voice.input"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t.voice_input_placeholder}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
          />
          <Button
            data-ocid="voice.submit_button"
            onClick={handleTextSubmit}
            disabled={isLoading || !textInput.trim()}
            className="bg-gold hover:bg-gold-light text-navy font-bold"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
