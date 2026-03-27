import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  useAddCase,
  useCases,
  useDocuments,
  useGuidanceHistory,
} from "@/hooks/useQueries";
import {
  ArrowLeft,
  Briefcase,
  FileText,
  History,
  Loader2,
  MessageSquare,
  PlusCircle,
  Send,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CaseStatus } from "../backend.d";
import { VakyomLogo } from "../components/VakyomLogo";
import { useTranslation } from "../i18n/useTranslation";

const STATUS_STYLES: Record<string, string> = {
  [CaseStatus.Active]: "bg-blue-500/20 text-blue-300",
  [CaseStatus.Resolved]: "bg-green-500/20 text-green-300",
  [CaseStatus.Pending]: "bg-yellow-500/20 text-yellow-300",
};

const STATUS_PROGRESS: Record<string, number> = {
  [CaseStatus.Pending]: 20,
  [CaseStatus.Active]: 60,
  [CaseStatus.Resolved]: 100,
};

const ISSUE_TYPES = [
  "Property Law",
  "Criminal Law",
  "Family Law",
  "Corporate Law",
  "Civil Law",
  "Consumer Rights",
  "Labour Law",
  "Other",
];

const FALLBACK_CASES = [
  {
    id: 1n,
    title: "Property Boundary Dispute — Sector 12",
    issueType: "Property Law",
    status: CaseStatus.Active,
    createdDate: 1700000000000n,
    lastUpdated: 1700000000000n,
    description: "Encroachment dispute with neighboring plot owner.",
  },
  {
    id: 2n,
    title: "Consumer Complaint — Defective Appliance",
    issueType: "Consumer Rights",
    status: CaseStatus.Pending,
    createdDate: 1710000000000n,
    lastUpdated: 1710000000000n,
    description:
      "Filed complaint against manufacturer for defective refrigerator.",
  },
  {
    id: 3n,
    title: "Employment Wrongful Termination",
    issueType: "Labour Law",
    status: CaseStatus.Resolved,
    createdDate: 1690000000000n,
    lastUpdated: 1690000000000n,
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

function StarRating({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
      <legend className="sr-only">Star rating</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((starNum) => (
          <button
            key={starNum}
            type="button"
            data-ocid={`feedback.star.${starNum}`}
            onClick={() => onChange(starNum)}
            onMouseEnter={() => setHovered(starNum)}
            onMouseLeave={() => setHovered(0)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px",
            }}
            aria-label={`${starNum} star`}
          >
            <Star
              size={26}
              style={{
                color:
                  starNum <= (hovered || value)
                    ? "oklch(0.72 0.14 78)"
                    : "rgba(255,255,255,0.2)",
                fill:
                  starNum <= (hovered || value)
                    ? "oklch(0.72 0.14 78)"
                    : "transparent",
                transition: "color 0.15s, fill 0.15s",
              }}
            />
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function MyCases({ onBack }: MyCasesProps) {
  const [activeTab, setActiveTab] = useState("cases");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { t } = useTranslation();
  const { actor } = useActor();

  const { data: cases, isLoading: casesLoading } = useCases();
  const { data: docs, isLoading: docsLoading } = useDocuments();
  const { data: history, isLoading: historyLoading } = useGuidanceHistory();
  const addCaseMutation = useAddCase();

  // Submit Case form state
  const [caseTitle, setCaseTitle] = useState("");
  const [caseIssue, setCaseIssue] = useState("");
  const [caseDesc, setCaseDesc] = useState("");
  const [caseErrors, setCaseErrors] = useState<Record<string, string>>({});
  const [submittingCase, setSubmittingCase] = useState(false);

  // Feedback state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const displayCases = cases && cases.length > 0 ? cases : FALLBACK_CASES;
  const displayDocs = docs && docs.length > 0 ? docs : FALLBACK_DOCS;
  const displayHistory =
    history && history.length > 0 ? history : FALLBACK_HISTORY;

  const TABS = [
    { id: "cases", label: t.cases_tab_active, icon: Briefcase },
    { id: "submit", label: "Submit Case", icon: PlusCircle },
    { id: "feedback", label: "Feedback", icon: Star },
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

  const validateCase = () => {
    const e: Record<string, string> = {};
    if (!caseTitle.trim()) e.title = "Case title is required";
    if (!caseIssue) e.issue = "Please select an issue type";
    if (!caseDesc.trim()) e.desc = "Description is required";
    setCaseErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCase()) return;
    setSubmittingCase(true);
    const now = BigInt(Date.now()) * 1_000_000n;
    try {
      await addCaseMutation.mutateAsync({
        id: 0n,
        title: caseTitle.trim(),
        issueType: caseIssue,
        description: caseDesc.trim(),
        status: CaseStatus.Pending,
        createdDate: now,
        lastUpdated: now,
      });
      toast.success("Case submitted successfully!");
      setCaseTitle("");
      setCaseIssue("");
      setCaseDesc("");
      setActiveTab("cases");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit case. Please try again.");
    } finally {
      setSubmittingCase(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend.");
      return;
    }
    setSubmittingFeedback(true);
    try {
      const ok = await actor.submitFeedback(BigInt(rating), comment.trim());
      if (ok) {
        setFeedbackSubmitted(true);
        toast.success("Thank you for your feedback!");
      } else {
        toast.error("Could not submit feedback.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    background: "rgba(255,255,255,0.07)",
    border: `1.5px solid ${hasError ? "rgba(220,50,50,0.8)" : "rgba(212,175,55,0.3)"}`,
    borderRadius: 10,
    color: "#fff",
    padding: "0.65rem 1rem",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
  });

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
          {t.cases_title}
        </span>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              type="button"
              key={tab.id}
              data-ocid={`cases.tab.item.${i + 1}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 justify-center ${activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* My Cases */}
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
                      className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${STATUS_STYLES[c.status as string] ?? "bg-muted text-muted-foreground"}`}
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
                  {/* Progress bar */}
                  <div
                    className="w-full h-1.5 rounded-full mb-2"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "oklch(0.72 0.14 78)" }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${STATUS_PROGRESS[c.status as string] ?? 0}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground mb-1">
                    <span>Pending</span>
                    <span>Active</span>
                    <span>Resolved</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.cases_filed} {formatDate(c.createdDate)}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Submit Case */}
        {activeTab === "submit" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              style={{
                background: "rgba(17,25,55,0.7)",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: 16,
                padding: "1.5rem",
              }}
            >
              <h2
                className="font-display font-bold text-gold mb-5"
                style={{ fontSize: "1.1rem" }}
              >
                Submit New Case
              </h2>
              <form onSubmit={handleSubmitCase} noValidate>
                <div className="mb-4">
                  <label
                    htmlFor="case-title-input"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Case Title
                  </label>
                  <input
                    id="case-title-input"
                    type="text"
                    data-ocid="cases.submit.input"
                    value={caseTitle}
                    onChange={(e) => {
                      setCaseTitle(e.target.value);
                      setCaseErrors((p) => ({ ...p, title: "" }));
                    }}
                    placeholder="Brief title describing the legal issue"
                    style={inputStyle(!!caseErrors.title)}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(212,175,55,0.85)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = caseErrors.title
                        ? "rgba(220,50,50,0.8)"
                        : "rgba(212,175,55,0.3)";
                    }}
                  />
                  {caseErrors.title && (
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "rgba(255,100,100,0.9)" }}
                    >
                      {caseErrors.title}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <p
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Issue Type
                  </p>
                  <Select
                    value={caseIssue}
                    onValueChange={(v) => {
                      setCaseIssue(v);
                      setCaseErrors((p) => ({ ...p, issue: "" }));
                    }}
                  >
                    <SelectTrigger
                      data-ocid="cases.submit.select"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: `1.5px solid ${caseErrors.issue ? "rgba(220,50,50,0.8)" : "rgba(212,175,55,0.3)"}`,
                        borderRadius: 10,
                        color: caseIssue ? "#fff" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      <SelectValue placeholder="Select type of legal issue" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        background: "#111933",
                        border: "1px solid rgba(212,175,55,0.3)",
                      }}
                    >
                      {ISSUE_TYPES.map((t) => (
                        <SelectItem key={t} value={t} style={{ color: "#fff" }}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {caseErrors.issue && (
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "rgba(255,100,100,0.9)" }}
                    >
                      {caseErrors.issue}
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="case-desc-textarea"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Description
                  </label>
                  <textarea
                    id="case-desc-textarea"
                    data-ocid="cases.submit.textarea"
                    value={caseDesc}
                    onChange={(e) => {
                      setCaseDesc(e.target.value);
                      setCaseErrors((p) => ({ ...p, desc: "" }));
                    }}
                    placeholder="Describe your legal situation in detail…"
                    rows={5}
                    style={{ ...inputStyle(!!caseErrors.desc), resize: "none" }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(212,175,55,0.85)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = caseErrors.desc
                        ? "rgba(220,50,50,0.8)"
                        : "rgba(212,175,55,0.3)";
                    }}
                  />
                  {caseErrors.desc && (
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "rgba(255,100,100,0.9)" }}
                    >
                      {caseErrors.desc}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  data-ocid="cases.submit.submit_button"
                  disabled={submittingCase}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: 10,
                    border: "none",
                    background: submittingCase
                      ? "rgba(212,175,55,0.4)"
                      : "linear-gradient(135deg, #d4af37, #c9942a)",
                    color: submittingCase ? "rgba(10,15,30,0.6)" : "#0a0f1e",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                    cursor: submittingCase ? "not-allowed" : "pointer",
                    transition: "opacity 0.2s",
                    boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
                  }}
                >
                  {submittingCase ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                    </span>
                  ) : (
                    "Submit Case →"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Feedback */}
        {activeTab === "feedback" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              style={{
                background: "rgba(17,25,55,0.7)",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: 16,
                padding: "1.5rem",
              }}
            >
              <h2
                className="font-display font-bold text-gold mb-1"
                style={{ fontSize: "1.1rem" }}
              >
                Rate Your Experience
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Your feedback helps us improve Vakyom
              </p>

              {feedbackSubmitted ? (
                <div
                  data-ocid="feedback.success_state"
                  className="text-center py-10"
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.15)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem",
                    }}
                  >
                    <Star
                      size={28}
                      style={{ color: "#86efac", fill: "#86efac" }}
                    />
                  </div>
                  <p
                    style={{
                      color: "#86efac",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Thank you for your feedback!
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Your review helps other users and improves our platform.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback}>
                  <div className="mb-5">
                    <p
                      className="block text-sm font-medium mb-3"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      Rating
                    </p>
                    <StarRating value={rating} onChange={setRating} />
                    {rating > 0 && (
                      <p
                        className="mt-2 text-sm"
                        style={{ color: "oklch(0.72 0.14 78)" }}
                      >
                        {
                          ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                            rating - 1
                          ]
                        }
                      </p>
                    )}
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="feedback-comment"
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      Comment (optional)
                    </label>
                    <Textarea
                      id="feedback-comment"
                      data-ocid="feedback.textarea"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with Vakyom…"
                      rows={4}
                      className="resize-none bg-card border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    data-ocid="feedback.submit_button"
                    disabled={submittingFeedback || rating === 0}
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: 10,
                      border: "none",
                      background:
                        submittingFeedback || rating === 0
                          ? "rgba(212,175,55,0.3)"
                          : "linear-gradient(135deg, #d4af37, #c9942a)",
                      color:
                        submittingFeedback || rating === 0
                          ? "rgba(10,15,30,0.4)"
                          : "#0a0f1e",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      cursor:
                        submittingFeedback || rating === 0
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {submittingFeedback ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                      </span>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </form>
              )}
            </div>
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
