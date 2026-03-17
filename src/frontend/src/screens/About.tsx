import {
  ArrowLeft,
  Eye,
  Globe,
  Heart,
  Shield,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { FounderName } from "../components/FounderName";
import { VakyomLogo } from "../components/VakyomLogo";
import { useTranslation } from "../i18n/useTranslation";

interface AboutProps {
  onBack: () => void;
}

export function About({ onBack }: AboutProps) {
  const { t } = useTranslation();

  const FEATURES = [
    {
      icon: Globe,
      title: t.about_feature_lang_title,
      desc: t.about_feature_lang_desc,
    },
    {
      icon: Shield,
      title: t.about_feature_lawyers_title,
      desc: t.about_feature_lawyers_desc,
    },
    {
      icon: Zap,
      title: t.about_feature_ai_title,
      desc: t.about_feature_ai_desc,
    },
    {
      icon: Heart,
      title: t.about_feature_citizen_title,
      desc: t.about_feature_citizen_desc,
    },
  ];

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
          {t.about_title}
        </span>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* Hero banner */}
        <div className="bg-navy px-6 py-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <VakyomLogo size={80} className="mx-auto" />
          </motion.div>
          <motion.h1
            className="text-4xl font-display font-bold text-gold mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Vakyom
          </motion.h1>
          <motion.p
            className="text-white/70 text-lg font-display italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t.about_tagline}
          </motion.p>
        </div>

        <div className="px-6 py-8 space-y-8">
          {/* Mission statement */}
          <motion.div
            data-ocid="about.card"
            className="p-6 rounded-2xl bg-gold/10 border-l-4 border-gold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-gold" />
              <span className="font-semibold text-gold/80 uppercase text-xs tracking-wide">
                {t.about_mission}
              </span>
            </div>
            <p className="text-lg font-display font-semibold text-foreground leading-relaxed">
              {t.about_mission_text}
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            className="p-6 rounded-2xl bg-card border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-gold" />
              <span className="font-semibold text-foreground uppercase text-xs tracking-wide">
                {t.about_vision}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t.about_vision_text}
            </p>
          </motion.div>

          {/* Features grid */}
          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-4">
              {t.about_what_we_offer}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="p-4 rounded-xl bg-card border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                    <f.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Founder section */}
          <motion.div
            className="p-6 rounded-2xl bg-navy text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-white/70 mb-4 uppercase tracking-wide text-sm">
              {t.about_founder}
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-display font-bold text-gold">
                  TK
                </span>
              </div>
              <div>
                <div className="text-2xl font-display font-bold">
                  <FounderName className="text-2xl" />
                </div>
                <div className="text-white/60 text-sm mt-1">
                  {t.about_founder_role}
                </div>
                <div className="bg-gold/20 text-gold text-xs px-2 py-0.5 rounded-full inline-block mt-1 font-semibold">
                  {t.welcome_founder_badge}
                </div>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {t.about_founder_bio}
            </p>
          </motion.div>

          {/* Footer */}
          <div className="text-center pt-4 pb-8">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()}. Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
