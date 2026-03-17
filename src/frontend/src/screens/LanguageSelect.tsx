import { Button } from "@/components/ui/button";
import { Check, Scale } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Language } from "../backend.d";
import { useSetUserLanguage } from "../hooks/useQueries";
import { useTranslation } from "../i18n/useTranslation";

const LANGUAGES: { key: Language; label: string; script: string }[] = [
  { key: Language.English, label: "English", script: "English" },
  { key: Language.Hindi, label: "Hindi", script: "हिंदी" },
  { key: Language.Kannada, label: "Kannada", script: "ಕನ್ನಡ" },
  { key: Language.Tamil, label: "Tamil", script: "தமிழ்" },
  { key: Language.Telugu, label: "Telugu", script: "తెలుగు" },
  { key: Language.Bengali, label: "Bengali", script: "বাংলা" },
];

interface LanguageSelectProps {
  onContinue: (lang: Language) => void;
}

export function LanguageSelect({ onContinue }: LanguageSelectProps) {
  const [selected, setSelected] = useState<Language>(Language.English);
  const setLang = useSetUserLanguage();
  const { t } = useTranslation();

  const handleContinue = () => {
    // Navigate immediately — save language in background
    setLang.mutate(selected);
    onContinue(selected);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col screen-enter">
      {/* Header */}
      <header className="bg-navy px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
          <Scale
            className="w-4 h-4"
            style={{ color: "oklch(0.13 0.04 250)" }}
          />
        </div>
        <span className="font-display font-bold text-gold text-xl">Vakyom</span>
      </header>

      <main className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            {t.choose_language}
          </h1>
          <p className="text-muted-foreground mb-8">{t.choose_language_desc}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            {LANGUAGES.map((lang, i) => (
              <motion.button
                key={lang.key}
                data-ocid={`language.select.item.${i + 1}`}
                onClick={() => setSelected(lang.key)}
                className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                  selected === lang.key
                    ? "border-gold bg-gold/10"
                    : "border-border bg-card hover:border-gold/40"
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {selected === lang.key && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                    <Check
                      className="w-3 h-3"
                      style={{ color: "oklch(0.13 0.04 250)" }}
                    />
                  </div>
                )}
                <div className="text-2xl font-bold text-gold mb-1">
                  {lang.script}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {lang.label}
                </div>
              </motion.button>
            ))}
          </div>

          <Button
            data-ocid="language.submit_button"
            onClick={handleContinue}
            size="lg"
            className="w-full font-bold text-lg py-6"
            style={{
              backgroundColor: "oklch(0.72 0.14 78)",
              color: "oklch(0.13 0.04 250)",
            }}
          >
            {t.continue}
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
