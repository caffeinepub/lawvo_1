import { Briefcase, FileText, Info, Mic, Scale, Users } from "lucide-react";
import { motion } from "motion/react";
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

export function Dashboard({ onNavigate }: DashboardProps) {
  const { t } = useTranslation();

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
                onClick={() => onNavigate(card.id)}
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
    </div>
  );
}
