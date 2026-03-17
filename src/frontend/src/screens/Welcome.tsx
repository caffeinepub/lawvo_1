import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  FileText,
  MessageSquare,
  Scale,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { FounderName } from "../components/FounderName";
import { useTranslation } from "../i18n/useTranslation";

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  const { t } = useTranslation();

  const handleLearnMore = () => {
    document
      .getElementById("features-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const FEATURES = [
    {
      icon: MessageSquare,
      title: t.welcome_feature_voice_title,
      desc: t.welcome_feature_voice_desc,
    },
    {
      icon: FileText,
      title: t.welcome_feature_doc_title,
      desc: t.welcome_feature_doc_desc,
    },
    {
      icon: Scale,
      title: t.welcome_feature_lawyer_title,
      desc: t.welcome_feature_lawyer_desc,
    },
    {
      icon: Shield,
      title: t.welcome_feature_lang_title,
      desc: t.welcome_feature_lang_desc,
    },
  ];

  return (
    <div className="min-h-screen bg-navy text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, oklch(0.72 0.14 78) 0%, transparent 50%), radial-gradient(circle at 75% 75%, oklch(0.55 0.12 250) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, oklch(0.97 0.004 255) 40px, oklch(0.97 0.004 255) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, oklch(0.97 0.004 255) 40px, oklch(0.97 0.004 255) 41px)",
          }}
        />

        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Logo mark */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center shadow-gold">
              <Scale className="w-8 h-8 text-navy" />
            </div>
            <div className="text-left">
              <div className="text-4xl font-display font-bold text-gold leading-none">
                Vakyom
              </div>
              <div className="text-xs text-white/60 tracking-widest uppercase mt-1">
                Legal Intelligence
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-display font-bold leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.welcome_title}
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl font-display italic text-white/80 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t.welcome_tagline}
          </motion.p>

          <motion.p
            className="text-lg text-white/70 mb-8 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t.welcome_subtitle}
          </motion.p>

          {/* Founder badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-navy-light border border-gold/30 rounded-full px-5 py-2.5 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Shield className="w-4 h-4 text-gold" />
            <span className="text-white/70 text-sm">
              {t.welcome_created_by}
            </span>
            <FounderName className="text-sm" />
            <span className="bg-gold/20 text-gold text-xs px-2 py-0.5 rounded-full font-semibold">
              {t.welcome_founder_badge}
            </span>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              data-ocid="welcome.primary_button"
              onClick={onGetStarted}
              size="lg"
              className="bg-gold hover:bg-gold-light text-navy font-bold text-lg px-10 py-6 shadow-gold transition-all duration-200 hover:scale-105"
            >
              {t.welcome_get_started}
            </Button>
            <Button
              data-ocid="welcome.secondary_button"
              onClick={handleLearnMore}
              variant="outline"
              size="lg"
              className="border-gold/60 text-gold hover:bg-gold/10 text-lg px-10 py-6 transition-all duration-200"
            >
              {t.welcome_learn_more}
            </Button>
          </motion.div>

          <motion.div
            className="mt-16 flex justify-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <ChevronDown className="w-6 h-6 text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features section */}
      <section id="features-section" className="bg-navy-light px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.welcome_why_title.split("Vakyom")[0]}
            <span className="text-gold">Vakyom?</span>
          </motion.h2>
          <motion.p
            className="text-white/60 text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t.welcome_why_subtitle}
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="flex gap-4 p-6 rounded-xl bg-navy border border-white/10 hover:border-gold/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gold hover:bg-gold-light text-navy font-bold px-10 py-6 shadow-gold transition-all duration-200 hover:scale-105"
            >
              {t.welcome_start_journey}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy border-t border-white/10 px-6 py-8 text-center">
        <p className="text-white/40 text-sm">
          &copy; {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/60 hover:text-gold transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
