import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Briefcase,
  FileText,
  History,
  Loader2,
  MessageSquare,
  Scale,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CaseStatus } from "../backend.d";
import {
  useCases,
  useDocuments,
  useGuidanceHistory,
} from "../hooks/useQueries";
import { useTranslation } from "../i18n/useTranslation";

const STATUS_STYLES: Record<string, string> = {
  [CaseStatus.Active]: "bg-blue-500/20 text-blue-300",
  [CaseStatus.Resolved]: "bg-green-500/20 text-green-300",
  [CaseStatus.Pending]: "bg-yellow-500/20 text-yellow-300",
};

const FALLBACK_CASES = [
  {
    id: 1n,
    title: "Property Boundary Dispute — Sector 12",
    issueType: "Property Law",
    status: CaseStatus.Active,
    createdDate: 1700000000000n,
    description: "Encroachment dispute with neighboring plot owner.",
  },
  {
    id: 2n,
    title: "Consumer Complaint — Defective Appliance",
    issueType: "Consumer Rights",
    status: CaseStatus.Pending,
    createdDate: 1710000000000n,
    description:
      "Filed complaint against manufacturer for defective refrigerator.",
  },
  {
    id: 3n,
    title: "Employment Wrongful Termination",
    issueType: "Labour Law",
    status: CaseStatus.Resolved,
    createdDate: 1690000000000n,
    description: "Case resolved in favour of employee with full settlement.",
  },
];

const FALLBACK_DOCS = [
  {
    id: 1n,
    filename: "Property_Sale_Deed_2024.pdf",
    uploadDate: 1710000000000n,
    analysisSummary:
      "Residential property sale agreement. No adverse clauses detected.",
  },
  {
    id: 2n,
    filename: "Legal_Notice_March2024.pdf",
    uploadDate: 1711000000000n,
    analysisSummary:
      "Property encroachment notice. Response required within 30 days.",
  },
];

const FALLBACK_HISTORY = [
  {
    id: 1n,
    queryText: "I received a legal notice for property. What should I do?",
    timestamp: 1711000000000n,
    resultSummary:
      "Respond within 30 days, gather documents, consult a property lawyer.",
  },
  {
    id: 2n,
    queryText: "How to file a consumer complaint?",
    timestamp: 1710000000000n,
    resultSummary:
      "File at consumer forum within 2 years of purchase. Keep all receipts.",
  },
];

interface MyCasesProps {
  onBack: () => void;
}

export function MyCases({ onBack }: MyCasesProps) {
  const [activeTab, setActiveTab] = useState("cases");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { t } = useTranslation();

  const { data: cases, isLoading: casesLoading } = useCases();
  const { data: docs, isLoading: docsLoading } = useDocuments();
  const { data: history, isLoading: historyLoading } = useGuidanceHistory();

  const displayCases = cases && cases.length > 0 ? cases : FALLBACK_CASES;
  const displayDocs = docs && docs.length > 0 ? docs : FALLBACK_DOCS;
  const displayHistory =
    history && history.length > 0 ? history : FALLBACK_HISTORY;

  const TABS = [
    { id: "cases", label: t.cases_tab_active, icon: Briefcase },
    { id: "docs", label: t.cases_tab_documents, icon: FileText },
    { id: "history", label: t.cases_tab_guidance, icon: History },
    { id: "message", label: t.cases_tab_message, icon: MessageSquare },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setMessage("");
      toast.success("Message sent to your lawyer!");
    }, 1200);
  };

  const formatDate = (ts: bigint) => {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
          <Scale
            className="w-4 h-4"
            style={{ color: "oklch(0.13 0.04 250)" }}
          />
        </div>
        <span className="font-display font-bold text-gold text-xl">
          {t.cases_title}
        </span>
      </header>

      <main className="px-6 py-6 max-w-2xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              type="button"
              key={tab.id}
              data-ocid={`cases.tab.item.${i + 1}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active Cases */}
        {activeTab === "cases" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {casesLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </>
            ) : displayCases.length === 0 ? (
              <div
                data-ocid="cases.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{t.cases_empty}</p>
              </div>
            ) : (
              displayCases.map((c, i) => (
                <div
                  key={Number(c.id)}
                  data-ocid={`cases.card.item.${i + 1}`}
                  className="p-5 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-foreground text-sm">
                      {c.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                        STATUS_STYLES[c.status as string] ??
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.status as string}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs mb-2 text-foreground"
                  >
                    {c.issueType}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {c.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t.cases_filed} {formatDate(c.createdDate)}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Documents */}
        {activeTab === "docs" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {docsLoading ? (
              <>
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </>
            ) : (
              displayDocs.map((doc) => (
                <div
                  key={Number(doc.id)}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="font-medium text-sm text-foreground">
                      {doc.filename}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {doc.analysisSummary}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(doc.uploadDate)}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Guidance History */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {historyLoading ? (
              <>
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </>
            ) : (
              displayHistory.map((h) => (
                <div
                  key={Number(h.id)}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <p className="text-sm font-medium text-foreground mb-1 italic">
                    &ldquo;{h.queryText}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {h.resultSummary}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(h.timestamp)}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Message Lawyer */}
        {activeTab === "message" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              {t.cases_message_subtitle}
            </p>
            <Textarea
              data-ocid="cases.message.textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.cases_message_placeholder}
              rows={6}
              className="resize-none bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              data-ocid="cases.message.submit_button"
              onClick={handleSendMessage}
              disabled={sending || !message.trim()}
              size="lg"
              className="w-full font-bold py-5"
              style={{
                backgroundColor: "oklch(0.72 0.14 78)",
                color: "oklch(0.13 0.04 250)",
              }}
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t.cases_message_sending}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t.cases_message_send}
                </>
              )}
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
