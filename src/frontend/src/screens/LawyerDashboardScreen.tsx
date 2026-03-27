import { VakyomLogo } from "@/components/VakyomLogo";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, CheckCircle2, Clock, LogOut, Scale } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CaseStatus } from "../backend.d";

interface LawyerDashboardProps {
  onLogout: () => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  [CaseStatus.Active]: { bg: "rgba(59,130,246,0.2)", text: "#93c5fd" },
  [CaseStatus.Resolved]: { bg: "rgba(34,197,94,0.2)", text: "#86efac" },
  [CaseStatus.Pending]: { bg: "rgba(234,179,8,0.2)", text: "#fde047" },
};

export function LawyerDashboardScreen({ onLogout }: LawyerDashboardProps) {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();
  const lawyerName = localStorage.getItem("vakyom_lawyer_name") ?? "Lawyer";
  const [updatingCase, setUpdatingCase] = useState<bigint | null>(null);
  const [pendingStatuses, setPendingStatuses] = useState<
    Record<string, CaseStatus>
  >({});

  const { data: cases, isLoading } = useQuery({
    queryKey: ["lawyerCases"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLawyerCases();
    },
    enabled: !!actor && !isFetching,
  });

  const totalCases = cases?.length ?? 0;
  const activeCases =
    cases?.filter((c) => c.status === CaseStatus.Active).length ?? 0;
  const resolvedCases =
    cases?.filter((c) => c.status === CaseStatus.Resolved).length ?? 0;

  const handleStatusChange = (caseId: bigint, newStatus: CaseStatus) => {
    setPendingStatuses((prev) => ({ ...prev, [caseId.toString()]: newStatus }));
  };

  const handleUpdateStatus = async (caseId: bigint) => {
    const newStatus = pendingStatuses[caseId.toString()];
    if (!newStatus || !actor) return;
    setUpdatingCase(caseId);
    try {
      const ok = await actor.updateCaseStatus({ caseId, newStatus });
      if (ok) {
        toast.success("Case status updated!");
        qc.invalidateQueries({ queryKey: ["lawyerCases"] });
      } else {
        toast.error("Update failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setUpdatingCase(null);
    }
  };

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      className="min-h-screen screen-enter"
      style={{ background: "#0a0f1e" }}
    >
      {/* Header */}
      <header
        style={{
          background: "rgba(17,25,55,0.9)",
          borderBottom: "1px solid rgba(212,175,55,0.2)",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <VakyomLogo size={36} />
          <div>
            <span
              className="font-display font-bold text-gold"
              style={{ fontSize: "1.1rem", display: "block" }}
            >
              Vakyom
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                color: "rgba(212,175,55,0.7)",
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.3)",
                borderRadius: 9999,
                padding: "1px 8px",
              }}
            >
              Lawyer Portal
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
            {lawyerName}
          </span>
          <button
            type="button"
            data-ocid="lawyer_dashboard.button"
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.82rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              {
                label: "Total Cases",
                value: totalCases,
                icon: Briefcase,
                color: "oklch(0.72 0.14 78)",
              },
              {
                label: "Active",
                value: activeCases,
                icon: Clock,
                color: "#93c5fd",
              },
              {
                label: "Resolved",
                value: resolvedCases,
                icon: CheckCircle2,
                color: "#86efac",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(17,25,55,0.8)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: 14,
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                <stat.icon
                  size={20}
                  style={{ color: stat.color, margin: "0 auto 0.4rem" }}
                />
                <p
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: stat.color,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Cases */}
          <h2
            className="font-display font-bold text-gold mb-4"
            style={{ fontSize: "1.25rem" }}
          >
            Assigned Cases
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : !cases || cases.length === 0 ? (
            <div
              data-ocid="lawyer_dashboard.empty_state"
              style={{
                textAlign: "center",
                padding: "4rem 1rem",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              <Scale
                size={48}
                style={{ margin: "0 auto 1rem", opacity: 0.3 }}
              />
              <p>No cases assigned yet</p>
              <p style={{ fontSize: "0.8rem", marginTop: 4 }}>
                Cases will appear here when assigned by admin
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map((c, i) => {
                const currentStatus =
                  pendingStatuses[c.id.toString()] ?? c.status;
                const st = STATUS_STYLES[c.status as string] ?? {
                  bg: "rgba(255,255,255,0.1)",
                  text: "#fff",
                };
                return (
                  <motion.div
                    key={c.id.toString()}
                    data-ocid={`lawyer_dashboard.case.item.${i + 1}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: "rgba(17,25,55,0.8)",
                      border: "1px solid rgba(212,175,55,0.18)",
                      borderRadius: 16,
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "0.5rem",
                      }}
                    >
                      <h3
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "#fff",
                        }}
                      >
                        {c.title}
                      </h3>
                      <span
                        style={{
                          background: st.bg,
                          color: st.text,
                          borderRadius: 9999,
                          padding: "2px 10px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {c.status as string}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <Badge
                        variant="outline"
                        style={{
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.8)",
                        }}
                      >
                        {c.issueType}
                      </Badge>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        Filed {formatDate(c.createdDate)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.5,
                      }}
                    >
                      {c.description}
                    </p>

                    {/* Status update */}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <Select
                        value={currentStatus as string}
                        onValueChange={(v) =>
                          handleStatusChange(c.id, v as CaseStatus)
                        }
                      >
                        <SelectTrigger
                          data-ocid={`lawyer_dashboard.select.${i + 1}`}
                          style={{
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(212,175,55,0.3)",
                            borderRadius: 8,
                            color: "#fff",
                            fontSize: "0.82rem",
                            height: 34,
                            flex: 1,
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          style={{
                            background: "#111933",
                            border: "1px solid rgba(212,175,55,0.3)",
                          }}
                        >
                          {[
                            CaseStatus.Pending,
                            CaseStatus.Active,
                            CaseStatus.Resolved,
                          ].map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              style={{ color: "#fff", fontSize: "0.82rem" }}
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <button
                        type="button"
                        data-ocid={`lawyer_dashboard.save_button.${i + 1}`}
                        onClick={() => handleUpdateStatus(c.id)}
                        disabled={
                          updatingCase === c.id || currentStatus === c.status
                        }
                        style={{
                          padding: "0.35rem 0.9rem",
                          borderRadius: 8,
                          border: "none",
                          background:
                            updatingCase === c.id || currentStatus === c.status
                              ? "rgba(212,175,55,0.3)"
                              : "linear-gradient(135deg, #d4af37, #c9942a)",
                          color: "#0a0f1e",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          cursor:
                            updatingCase === c.id || currentStatus === c.status
                              ? "not-allowed"
                              : "pointer",
                          transition: "opacity 0.2s",
                        }}
                      >
                        {updatingCase === c.id ? "…" : "Update"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
