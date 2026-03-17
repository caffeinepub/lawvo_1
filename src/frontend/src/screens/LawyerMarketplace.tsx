import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Phone, Scale, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { VakyomLogo } from "../components/VakyomLogo";
import { useLawyerProfiles } from "../hooks/useQueries";
import { useTranslation } from "../i18n/useTranslation";

const SPECIALIZATIONS = [
  "All",
  "Property Law",
  "Criminal Law",
  "Family Law",
  "Corporate Law",
  "Labour Law",
  "Consumer Rights",
];

const FALLBACK_LAWYERS = [
  {
    id: 1n,
    name: "Adv. Priya Sharma",
    specialization: "Property Law",
    rating: 4.8,
    reviewsCount: 127n,
    location: "Bengaluru",
    bio: "15+ years experience in property disputes, land acquisition, and real estate transactions.",
    available: true,
  },
  {
    id: 2n,
    name: "Adv. Rajesh Mehta",
    specialization: "Criminal Law",
    rating: 4.6,
    reviewsCount: 89n,
    location: "Mumbai",
    bio: "Senior criminal defense lawyer with expertise in bail, trial proceedings, and appeals.",
    available: true,
  },
  {
    id: 3n,
    name: "Adv. Sunita Nair",
    specialization: "Family Law",
    rating: 4.9,
    reviewsCount: 203n,
    location: "Chennai",
    bio: "Specializing in divorce, child custody, domestic violence, and matrimonial disputes.",
    available: false,
  },
  {
    id: 4n,
    name: "Adv. Vikram Bose",
    specialization: "Corporate Law",
    rating: 4.5,
    reviewsCount: 64n,
    location: "Kolkata",
    bio: "Corporate lawyer handling mergers, acquisitions, contracts, and compliance matters.",
    available: true,
  },
  {
    id: 5n,
    name: "Adv. Ananya Reddy",
    specialization: "Labour Law",
    rating: 4.7,
    reviewsCount: 156n,
    location: "Hyderabad",
    bio: "Expert in employment disputes, wrongful termination, and labour tribunal representation.",
    available: true,
  },
  {
    id: 6n,
    name: "Adv. Suresh Kumar",
    specialization: "Consumer Rights",
    rating: 4.4,
    reviewsCount: 98n,
    location: "Delhi",
    bio: "Consumer rights advocate with strong track record in e-commerce and product liability cases.",
    available: true,
  },
];

interface LawyerMarketplaceProps {
  onBack: () => void;
}

export function LawyerMarketplace({ onBack }: LawyerMarketplaceProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: lawyers, isLoading } = useLawyerProfiles();
  const { t } = useTranslation();

  const displayLawyers = (
    lawyers && lawyers.length > 0 ? lawyers : FALLBACK_LAWYERS
  ).map((l) => ({
    ...l,
    id: Number(l.id),
    reviewsCount: Number(l.reviewsCount),
  }));

  const filtered =
    activeFilter === "All"
      ? displayLawyers
      : displayLawyers.filter((l) => l.specialization === activeFilter);

  const filterLabels: Record<string, string> = {
    All: t.lawyers_filter_all,
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
          {t.lawyers_title}
        </span>
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        <p className="text-muted-foreground mb-5">{t.lawyers_subtitle}</p>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SPECIALIZATIONS.map((spec) => (
            <button
              type="button"
              key={spec}
              data-ocid="lawyers.tab"
              onClick={() => setActiveFilter(spec)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === spec
                  ? "bg-navy text-gold border border-gold/30"
                  : "bg-muted text-muted-foreground hover:bg-navy/10"
              }`}
            >
              {filterLabels[spec] ?? spec}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((lawyer, i) => (
              <motion.div
                key={lawyer.id}
                data-ocid={`lawyers.card.item.${i + 1}`}
                className="p-5 rounded-xl bg-card border border-border hover:border-gold/30 transition-all duration-200"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {lawyer.name}
                    </h3>
                    <Badge className="bg-gold/10 text-gold border border-gold/20 text-xs mt-1">
                      {lawyer.specialization}
                    </Badge>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      lawyer.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {lawyer.available ? t.lawyers_available : t.lawyers_busy}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {lawyer.bio}
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(lawyer.rating)
                            ? "text-gold fill-gold"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {lawyer.rating.toFixed(1)} ({lawyer.reviewsCount}{" "}
                      {t.lawyers_reviews})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {lawyer.location}
                  </div>
                </div>

                <Button
                  data-ocid={`lawyers.button.item.${i + 1}`}
                  onClick={() =>
                    toast.success(
                      `Consultation request sent to ${lawyer.name}!`,
                    )
                  }
                  size="sm"
                  className="w-full bg-navy hover:bg-navy-mid text-gold border border-gold/20 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 mr-2" />
                  {t.lawyers_consult}
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Scale className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t.lawyers_empty}</p>
          </div>
        )}
      </main>
    </div>
  );
}
