import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  FileText,
  MessageSquare,
  Scale,
  Shield,
  Star,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { FounderName } from "../components/FounderName";
import { useTranslation } from "../i18n/useTranslation";

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  const { t } = useTranslation();
  const [founderOpen, setFounderOpen] = useState(false);

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
          {/* Big prominent logo block */}
          <motion.div
            className="flex flex-col items-center mb-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Logo image with glow */}
            <div className="relative mb-4">
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  boxShadow:
                    "0 0 60px 18px oklch(0.72 0.14 78 / 0.45), 0 0 120px 40px oklch(0.72 0.14 78 / 0.18)",
                }}
              />
              {/* Gold border ring */}
              <div
                className="absolute -inset-2 rounded-3xl"
                style={{
                  border: "2px solid oklch(0.72 0.14 78 / 0.5)",
                  borderRadius: "24px",
                }}
              />
              <img
                src="/assets/generated/vakyom-logo-transparent.dim_120x120.png"
                alt="Vakyom Logo"
                style={{ width: 120, height: 120, objectFit: "contain" }}
                className="relative z-10 drop-shadow-2xl"
              />
            </div>

            {/* Brand name */}
            <div className="text-6xl md:text-7xl font-display font-bold text-gold leading-none tracking-tight mb-1">
              Vakyom
            </div>

            <div className="text-xs text-white/40 tracking-[0.25em] uppercase mt-2">
              Legal Intelligence
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
            className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap"
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
            <Button
              data-ocid="welcome.open_modal_button"
              onClick={() => setFounderOpen(true)}
              variant="outline"
              size="lg"
              className="border-gold text-gold hover:bg-gold/10 text-lg px-10 py-6 transition-all duration-200"
              style={{ borderColor: "oklch(0.72 0.14 78 / 0.8)" }}
            >
              <User className="w-5 h-5 mr-2" />
              Know the Founder
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

      {/* About the Founder section */}
      <section className="bg-navy px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            data-ocid="founder.card"
            className="relative rounded-2xl p-8 md:p-12 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.03 250 / 0.9) 0%, oklch(0.14 0.025 250 / 0.95) 100%)",
              border: "1.5px solid oklch(0.72 0.14 78 / 0.45)",
              boxShadow:
                "0 0 40px 8px oklch(0.72 0.14 78 / 0.18), 0 8px 48px oklch(0 0 0 / 0.4)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Subtle gold radial glow in background */}
            <div
              className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.72 0.14 78) 0%, transparent 70%)",
              }}
            />

            {/* Section label */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "oklch(0.72 0.14 78 / 0.15)",
                  border: "1px solid oklch(0.72 0.14 78 / 0.4)",
                }}
              >
                <User className="w-5 h-5 text-gold" />
              </div>
              <span
                className="text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: "oklch(0.72 0.14 78)" }}
              >
                Meet the Founder
              </span>
              <span
                className="ml-auto flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: "oklch(0.72 0.14 78 / 0.15)",
                  border: "1px solid oklch(0.72 0.14 78 / 0.35)",
                  color: "oklch(0.72 0.14 78)",
                }}
              >
                <Star className="w-3 h-3 fill-current" />
                Founder
              </span>
            </motion.div>

            {/* Founder name — large and highlighted */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2
                className="text-4xl md:text-5xl font-display font-bold leading-tight"
                style={{
                  color: "oklch(0.72 0.14 78)",
                  textShadow:
                    "0 0 32px oklch(0.72 0.14 78 / 0.5), 0 2px 8px oklch(0 0 0 / 0.4)",
                }}
              >
                <FounderName className="text-4xl md:text-5xl" />
              </h2>
            </motion.div>

            {/* Bio */}
            <motion.p
              className="text-white/75 text-lg leading-relaxed max-w-xl mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FounderName className="text-base" /> is the visionary founder of{" "}
              <span
                className="font-semibold"
                style={{ color: "oklch(0.72 0.14 78)" }}
              >
                Vakyom
              </span>
              , dedicated to making legal guidance accessible to every citizen
              through the power of AI and technology.
            </motion.p>

            {/* Know More button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Button
                data-ocid="founder.open_modal_button"
                onClick={() => setFounderOpen(true)}
                variant="outline"
                className="font-semibold px-6 py-2 transition-all duration-200 hover:scale-105"
                style={{
                  borderColor: "oklch(0.72 0.14 78 / 0.7)",
                  color: "oklch(0.72 0.14 78)",
                  background: "oklch(0.72 0.14 78 / 0.08)",
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Know About the Founder
              </Button>
            </motion.div>

            {/* Decorative bottom bar */}
            <motion.div
              className="mt-8 h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.72 0.14 78 / 0.6) 0%, oklch(0.72 0.14 78 / 0.05) 100%)",
              }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            />

            <motion.p
              className="mt-4 text-white/40 text-sm italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              "Empowering every Indian with the legal knowledge they deserve."
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy border-t border-white/10 px-6 py-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/50 text-sm">
            Founded by <FounderName className="text-sm" />
          </p>
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: "oklch(0.72 0.14 78 / 0.7)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Founder Dialog */}
      <Dialog open={founderOpen} onOpenChange={setFounderOpen}>
        <DialogContent
          data-ocid="founder.dialog"
          className="max-w-lg w-full p-0 overflow-hidden"
          style={{
            background: "oklch(0.14 0.025 250)",
            border: "1.5px solid oklch(0.72 0.14 78 / 0.5)",
            boxShadow:
              "0 0 60px 12px oklch(0.72 0.14 78 / 0.18), 0 24px 80px oklch(0 0 0 / 0.6)",
          }}
        >
          {/* Gold top accent line */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.72 0.14 78 / 0.1) 0%, oklch(0.72 0.14 78) 50%, oklch(0.72 0.14 78 / 0.1) 100%)",
            }}
          />

          <div className="px-8 py-8">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.72 0.14 78 / 0.15)",
                    border: "1px solid oklch(0.72 0.14 78 / 0.4)",
                  }}
                >
                  <User
                    className="w-5 h-5"
                    style={{ color: "oklch(0.72 0.14 78)" }}
                  />
                </div>
                <DialogTitle
                  className="text-2xl font-display font-bold"
                  style={{
                    color: "oklch(0.72 0.14 78)",
                    textShadow: "0 0 20px oklch(0.72 0.14 78 / 0.4)",
                  }}
                >
                  About the Founder
                </DialogTitle>
              </div>
            </DialogHeader>

            {/* Founder name large */}
            <div className="mb-6">
              <div
                className="text-3xl md:text-4xl font-display font-bold mb-1"
                style={{
                  color: "oklch(0.72 0.14 78)",
                  textShadow:
                    "0 0 28px oklch(0.72 0.14 78 / 0.5), 0 2px 8px oklch(0 0 0 / 0.4)",
                }}
              >
                <FounderName className="text-3xl md:text-4xl" />
              </div>
              <div
                className="text-xs tracking-[0.2em] uppercase font-semibold"
                style={{ color: "oklch(0.72 0.14 78 / 0.65)" }}
              >
                Founder &amp; Visionary, Vakyom
              </div>
            </div>

            {/* Divider */}
            <div
              className="h-px w-full mb-6"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.72 0.14 78 / 0.5) 0%, oklch(0.72 0.14 78 / 0.05) 100%)",
              }}
            />

            {/* About Me section */}
            <div className="mb-5">
              <h3
                className="text-xs font-bold tracking-[0.18em] uppercase mb-2"
                style={{ color: "oklch(0.72 0.14 78 / 0.8)" }}
              >
                About Me
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">
                Tarun Kumar is a passionate legal-tech entrepreneur and the
                visionary founder of Vakyom. With a deep commitment to social
                justice and access to law, Tarun built Vakyom from the ground up
                to bridge the gap between complex legal systems and ordinary
                citizens across India.
              </p>
            </div>

            {/* Vision section */}
            <div className="mb-6">
              <h3
                className="text-xs font-bold tracking-[0.18em] uppercase mb-2"
                style={{ color: "oklch(0.72 0.14 78 / 0.8)" }}
              >
                The Idea &amp; Vision
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">
                The idea behind Vakyom was born from a simple yet powerful
                observation — millions of Indians face legal challenges every
                day but lack access to affordable, trusted legal guidance.
                Vakyom uses AI-powered voice assistance, multilingual support,
                and a curated lawyer marketplace to put justice in everyone's
                hands — regardless of language, location, or income.
              </p>
            </div>

            {/* Mission quote blockquote */}
            <blockquote
              className="rounded-xl px-6 py-4 mb-8 italic text-base font-medium"
              style={{
                background: "oklch(0.72 0.14 78 / 0.08)",
                borderLeft: "3px solid oklch(0.72 0.14 78 / 0.8)",
                color: "oklch(0.72 0.14 78)",
              }}
            >
              &ldquo;Empowering every Indian with the legal knowledge they
              deserve.&rdquo;
            </blockquote>

            {/* Close button */}
            <Button
              data-ocid="founder.close_button"
              onClick={() => setFounderOpen(false)}
              className="w-full font-semibold py-3"
              style={{
                background: "oklch(0.72 0.14 78 / 0.15)",
                border: "1px solid oklch(0.72 0.14 78 / 0.5)",
                color: "oklch(0.72 0.14 78)",
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
