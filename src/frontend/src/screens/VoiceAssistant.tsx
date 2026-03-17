import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Mic, MicOff, Scale, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "../i18n/useTranslation";

const SAMPLE_QUERY =
  "I received a legal notice regarding property. What should I do?";

const SIMULATED_RESPONSE = `Based on your situation, here is what you should do:

**Immediate Steps (Within 7 Days)**
• Do not ignore the notice — responding is legally required in most cases
• Read the notice carefully to identify the sender, the legal claim, and the deadline to respond

**Within 30 Days**
• Gather all property-related documents: title deed, sale agreement, tax receipts, and mutation records
• Consult a property lawyer to understand the legal implications and draft a proper response

**Important Points**
• A legal notice is a formal communication — ignoring it may result in court proceedings against you
• Your response (or non-response) can significantly impact future legal proceedings
• If the notice involves a government authority, check for any encroachment or acquisition notices

**Recommended Action**
Consult a qualified property lawyer within 2 weeks. Vakyom can connect you with verified property law experts in your city.

*Disclaimer: This is general legal information, not legal advice. Please consult a qualified lawyer for advice specific to your situation.*`;

interface VoiceAssistantProps {
  onBack: () => void;
}

export function VoiceAssistant({ onBack }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [textInput, setTextInput] = useState("");
  const { t } = useTranslation();

  const handleMicClick = () => {
    if (showResponse) {
      setShowResponse(false);
      setIsListening(false);
      return;
    }
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setShowResponse(true);
        }, 1800);
      }, 2500);
    } else {
      setIsListening(false);
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
        <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
          <Scale className="w-4 h-4 text-navy" />
        </div>
        <span className="font-display font-bold text-gold text-xl">
          {t.talk_to_vakyom}
        </span>
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        {/* Example query */}
        <div className="mb-8 p-4 rounded-xl bg-muted border border-border">
          <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
            {t.voice_example_query_label}
          </p>
          <p className="text-sm text-foreground italic">"{SAMPLE_QUERY}"</p>
        </div>

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
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-4 h-4 text-gold" />
                <span className="text-gold font-semibold text-sm">
                  {t.voice_response_title}
                </span>
              </div>
              <div className="text-sm text-white/85 leading-relaxed whitespace-pre-line">
                {SIMULATED_RESPONSE}
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
