import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Scale,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { VakyomLogo } from "../components/VakyomLogo";
import { useTranslation } from "../i18n/useTranslation";

const GUIDANCE_DATA = {
  issue: "Property Dispute",
  description:
    "A property boundary dispute between neighboring landowners regarding encroachment on residential land.",
  steps: [
    "Collect all ownership documents including title deed, sale deed, and property tax receipts",
    "Obtain a certified copy of the land survey map from the local revenue office",
    "Check revenue records and mutation entries at the Tahsildar's office",
    "Consult a qualified property/civil lawyer to assess strength of your legal claim",
    "Send a legal notice to the opposing party before filing a civil suit",
  ],
  timeline: "6–12 months",
  riskLevel: "Medium",
  relevantLaw: "Transfer of Property Act, 1882 | Civil Procedure Code, 1908",
};

interface LegalGuidanceProps {
  onBack: () => void;
  onConnectLawyer: () => void;
}

export function LegalGuidance({ onBack, onConnectLawyer }: LegalGuidanceProps) {
  const { t } = useTranslation();

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
          {t.guidance_title}
        </span>
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        <motion.div
          data-ocid="guidance.card"
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Issue identified */}
          <div className="p-6 rounded-2xl bg-navy text-white">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-gold" />
              <span className="text-gold font-semibold text-sm uppercase tracking-wide">
                {t.guidance_issue_label}
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white">
              {GUIDANCE_DATA.issue}
            </h2>
            <p className="text-white/70 text-sm mt-2 leading-relaxed">
              {GUIDANCE_DATA.description}
            </p>
            <div className="mt-4 flex gap-3 flex-wrap">
              <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Risk: {GUIDANCE_DATA.riskLevel}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Clock className="w-3 h-3 mr-1" />
                {GUIDANCE_DATA.timeline}
              </Badge>
            </div>
          </div>

          {/* Steps */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold text-foreground mb-4">
              {t.guidance_steps_title}
            </h3>
            <ol className="space-y-3">
              {GUIDANCE_DATA.steps.map((step, i) => (
                <motion.li
                  key={step.slice(0, 20)}
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                >
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground leading-relaxed">
                    {step}
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Relevant law */}
          <div className="p-4 rounded-xl bg-muted border border-border">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
              {t.guidance_law_label}
            </p>
            <p className="text-sm text-foreground font-medium">
              {GUIDANCE_DATA.relevantLaw}
            </p>
          </div>

          {/* CTA */}
          <Button
            data-ocid="guidance.primary_button"
            onClick={onConnectLawyer}
            size="lg"
            className="w-full bg-gold hover:bg-gold-light text-navy font-bold py-6 shadow-gold"
          >
            <Users className="w-4 h-4 mr-2" />
            {t.guidance_connect_lawyer}
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
