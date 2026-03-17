import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  FileText,
  Image,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { VakyomLogo } from "../components/VakyomLogo";
import { useTranslation } from "../i18n/useTranslation";

const ANALYSIS_RESULT = {
  summary:
    "This is a Property Sale Agreement dated March 2024 between Rajesh Kumar (Seller) and Priya Sharma (Buyer) for a residential property located in Bengaluru, Karnataka. The total consideration is ₹85,00,000.",
  clauses: [
    "Possession to be handed over within 90 days of payment",
    "Penalty clause: 2% per month on delayed payment",
    "Arbitration clause: Disputes to be resolved in Bengaluru jurisdiction",
    "Force majeure clause included covering natural disasters",
    "Registration to be done within 30 days of signing",
  ],
  plainLanguage:
    "This is a standard property sale agreement. The buyer must pay the full amount within the agreed timeline or face penalties. The property will be transferred officially within 90 days. If there's any legal dispute, it will be handled by courts in Bengaluru. Overall, this is a fairly standard agreement but you should verify the property title is clear before signing.",
};

interface DocumentScannerProps {
  onBack: () => void;
}

export function DocumentScanner({ onBack }: DocumentScannerProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { t } = useTranslation();

  const UPLOAD_OPTIONS = [
    {
      icon: FileText,
      label: t.doc_upload_pdf,
      sub: t.doc_upload_pdf_sub,
    },
    { icon: Image, label: t.doc_upload_image, sub: t.doc_upload_image_sub },
    { icon: Camera, label: t.doc_scan_camera, sub: t.doc_scan_camera_sub },
  ];

  const handleGetGuidance = () => {
    if (selected === null) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 2000);
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
          {t.doc_title}
        </span>
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        <p className="text-muted-foreground mb-6">{t.doc_subtitle}</p>

        <div className="grid gap-4 mb-6">
          {UPLOAD_OPTIONS.map((opt, i) => (
            <motion.button
              key={opt.label}
              data-ocid={
                i === 0
                  ? "document.upload_button"
                  : i === 2
                    ? "document.dropzone"
                    : undefined
              }
              onClick={() => {
                setSelected(i);
                setShowResult(false);
              }}
              className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                selected === i
                  ? "border-gold bg-gold/5"
                  : "border-border bg-card hover:border-gold/40"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selected === i ? "bg-gold" : "bg-navy/10"
                }`}
              >
                <opt.icon className="w-6 h-6 text-navy" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{opt.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {opt.sub}
                </div>
              </div>
              {selected === i && (
                <CheckCircle className="ml-auto w-5 h-5 text-gold" />
              )}
            </motion.button>
          ))}
        </div>

        <Button
          data-ocid="document.primary_button"
          onClick={handleGetGuidance}
          disabled={selected === null || isLoading}
          size="lg"
          className="w-full bg-gold hover:bg-gold-light text-navy font-bold py-6 shadow-gold mb-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {t.doc_analyzing}
            </>
          ) : (
            t.doc_get_guidance
          )}
        </Button>

        {isLoading && (
          <div data-ocid="document.loading_state" className="text-center py-8">
            <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              {t.doc_analyzing_sub}
            </p>
          </div>
        )}

        <AnimatePresence>
          {showResult && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-5 rounded-xl bg-navy text-white border border-gold/20">
                <h3 className="font-semibold text-gold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> {t.doc_summary}
                </h3>
                <p className="text-sm text-white/85 leading-relaxed">
                  {ANALYSIS_RESULT.summary}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-3">
                  {t.doc_clauses}
                </h3>
                <ul className="space-y-2">
                  {ANALYSIS_RESULT.clauses.map((clause) => (
                    <li
                      key={clause}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-gold mt-0.5">•</span>
                      {clause}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-gold/10 border border-gold/30">
                <h3 className="font-semibold text-navy mb-3">
                  {t.doc_plain_language}
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {ANALYSIS_RESULT.plainLanguage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
