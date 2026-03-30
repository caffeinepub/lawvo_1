import { VakyomLogo } from "@/components/VakyomLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bot,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  MessageSquare,
  Pencil,
  RotateCcw,
  Scale,
  Shield,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CaseStatus } from "../backend.d";
import type { ChatbotEntry } from "../backend.d";

const ADMIN_PASSWORD = "Vakyom@2024";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  [CaseStatus.Active]: { bg: "rgba(59,130,246,0.2)", text: "#93c5fd" },
  [CaseStatus.Resolved]: { bg: "rgba(34,197,94,0.2)", text: "#86efac" },
  [CaseStatus.Pending]: { bg: "rgba(234,179,8,0.2)", text: "#fde047" },
};

interface AdminScreenProps {
  onLogout: () => void;
}

function AdminLogin({ onAuthenticate }: { onAuthenticate: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onAuthenticate();
    } else {
      setError("Incorrect password. Access denied.");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#0a0f1e" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(212,175,55,0.1) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div
          style={{
            background: "rgba(17,25,55,0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: 20,
            padding: "2.5rem 2rem",
            boxShadow: "0 0 60px rgba(212,175,55,0.12)",
          }}
        >
          <div className="flex flex-col items-center gap-4 mb-8">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={28} style={{ color: "oklch(0.72 0.14 78)" }} />
            </div>
            <div className="text-center">
              <h1 className="font-display font-bold text-2xl text-gold">
                Admin Access
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Enter your admin password to continue
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <input
                type={show ? "text" : "password"}
                data-ocid="admin_login.input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Admin password"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.07)",
                  border: `1.5px solid ${error ? "rgba(220,50,50,0.8)" : "rgba(212,175,55,0.3)"}`,
                  borderRadius: 10,
                  color: "#fff",
                  padding: "0.65rem 2.75rem 0.65rem 1rem",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.85)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = error
                    ? "rgba(220,50,50,0.8)"
                    : "rgba(212,175,55,0.3)";
                }}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                }}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p
                data-ocid="admin_login.error_state"
                className="mb-4 text-sm text-center px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(220,50,50,0.12)",
                  border: "1px solid rgba(220,50,50,0.3)",
                  color: "rgba(255,120,120,0.95)",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              data-ocid="admin_login.submit_button"
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #d4af37, #c9942a)",
                color: "#0a0f1e",
                fontWeight: 700,
                fontSize: "1rem",
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(212,175,55,0.35)",
              }}
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("users");
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<string | null>(
    null,
  );
  const [confirmDeleteLawyer, setConfirmDeleteLawyer] = useState<string | null>(
    null,
  );

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllUsersAdmin();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: lawyers, isLoading: lawyersLoading } = useQuery({
    queryKey: ["admin-lawyers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllLawyers();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: feedbackList, isLoading: feedbackLoading } = useQuery({
    queryKey: ["admin-feedback"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: cases, isLoading: casesLoading } = useQuery({
    queryKey: ["admin-cases"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCases();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: loginRecords, isLoading: loginRecordsLoading } = useQuery({
    queryKey: ["admin-login-records"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllLoginRecords();
    },
    enabled: !!actor && !isFetching,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (principalId: string) => {
      if (!actor) throw new Error("No actor");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.deleteUser(Principal.fromText(principalId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmDeleteUser(null);
    },
  });

  const deleteLawyerMutation = useMutation({
    mutationFn: async (principalId: string) => {
      if (!actor) throw new Error("No actor");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.deleteLawyer(Principal.fromText(principalId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lawyers"] });
      setConfirmDeleteLawyer(null);
    },
  });

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const [editingEntry, setEditingEntry] = useState<ChatbotEntry | null>(null);
  const [editForm, setEditForm] = useState<{
    intro: string;
    whatToDo: string;
    documents: string;
    lawyerType: string;
    cost: string;
    timeRequired: string;
    successRate: string;
    tip: string;
  } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const { data: chatbotEntries, isLoading: chatbotLoading } = useQuery<
    ChatbotEntry[]
  >({
    queryKey: ["admin-chatbot-entries"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getChatbotEntries();
    },
    enabled: !!actor && !isFetching,
  });

  const updateChatbotMutation = useMutation({
    mutationFn: async (data: {
      id: bigint;
      intro: string;
      whatToDo: string;
      documents: string[];
      lawyerType: string;
      cost: string;
      timeRequired: string;
      successRate: string;
      tip: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return (actor as any).updateChatbotEntry(
        data.id,
        data.intro,
        data.whatToDo,
        data.documents,
        data.lawyerType,
        data.cost,
        data.timeRequired,
        data.successRate,
        data.tip,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-chatbot-entries"] });
      queryClient.invalidateQueries({ queryKey: ["chatbotEntries"] });
      setEditingEntry(null);
      setEditForm(null);
    },
  });

  const resetChatbotMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return (actor as any).resetChatbotEntries();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-chatbot-entries"] });
      queryClient.invalidateQueries({ queryKey: ["chatbotEntries"] });
      setConfirmReset(false);
    },
  });

  const openEdit = (entry: ChatbotEntry) => {
    setEditingEntry(entry);
    setEditForm({
      intro: entry.intro,
      whatToDo: entry.whatToDo,
      documents: entry.documents.join(", "),
      lawyerType: entry.lawyerType,
      cost: entry.cost,
      timeRequired: entry.timeRequired,
      successRate: entry.successRate,
      tip: entry.tip,
    });
  };

  const TABS = [
    { id: "users", label: "Users", icon: Users },
    { id: "lawyers", label: "Lawyers", icon: Scale },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "cases", label: "Cases", icon: Shield },
    { id: "logins", label: "Login History", icon: Clock },
    { id: "chatbot", label: "Chatbot", icon: Bot },
  ];

  return (
    <div
      className="min-h-screen screen-enter"
      style={{ background: "#0a0f1e" }}
    >
      {/* Header */}
      <header
        style={{
          background: "rgba(17,25,55,0.95)",
          borderBottom: "1px solid rgba(212,175,55,0.25)",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Shield size={24} style={{ color: "oklch(0.72 0.14 78)" }} />
          <div>
            <span
              className="font-display font-bold text-gold"
              style={{ fontSize: "1.1rem", display: "block" }}
            >
              Admin Control Panel
            </span>
            <span
              style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}
            >
              Vakyom Platform Management
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span
              style={{
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.3)",
                color: "oklch(0.72 0.14 78)",
                borderRadius: 9999,
                padding: "3px 10px",
                fontSize: "0.72rem",
                fontWeight: 600,
              }}
            >
              {users?.length ?? 0} Users
            </span>
            <span
              style={{
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.3)",
                color: "#93c5fd",
                borderRadius: 9999,
                padding: "3px 10px",
                fontSize: "0.72rem",
                fontWeight: 600,
              }}
            >
              {lawyers?.length ?? 0} Lawyers
            </span>
          </div>
          <button
            type="button"
            data-ocid="admin_panel.button"
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
            }}
          >
            <LogOut size={15} /> Exit
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 14,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={`admin_panel.${tab.id}.tab`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "0.6rem",
                borderRadius: 10,
                border: "none",
                background:
                  activeTab === tab.id
                    ? "rgba(212,175,55,0.15)"
                    : "transparent",
                color:
                  activeTab === tab.id
                    ? "oklch(0.72 0.14 78)"
                    : "rgba(255,255,255,0.5)",
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s",
                borderBottom:
                  activeTab === tab.id
                    ? "1.5px solid oklch(0.72 0.14 78)"
                    : "1.5px solid transparent",
              }}
            >
              <tab.icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* USERS TAB */}
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: 16,
                }}
              >
                <Users size={18} style={{ color: "oklch(0.72 0.14 78)" }} />
                <h2
                  className="font-display font-bold text-gold"
                  style={{ fontSize: "1.1rem" }}
                >
                  Registered Users
                </h2>
                {users && (
                  <span
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      color: "oklch(0.72 0.14 78)",
                      borderRadius: 9999,
                      padding: "2px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {users.length} total
                  </span>
                )}
              </div>
              {usersLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              ) : !users || users.length === 0 ? (
                <div
                  data-ocid="admin_panel.users.empty_state"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  <Users
                    size={40}
                    style={{ margin: "0 auto 0.75rem", opacity: 0.3 }}
                  />
                  <p>No users registered yet</p>
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(17,25,55,0.8)",
                    border: "1px solid rgba(212,175,55,0.15)",
                    borderRadius: 14,
                    overflow: "hidden",
                  }}
                >
                  <Table>
                    <TableHeader>
                      <TableRow
                        style={{
                          borderBottom: "1px solid rgba(212,175,55,0.15)",
                        }}
                      >
                        <TableHead
                          style={{
                            color: "rgba(212,175,55,0.8)",
                            fontWeight: 600,
                          }}
                        >
                          #
                        </TableHead>
                        <TableHead
                          style={{
                            color: "rgba(212,175,55,0.8)",
                            fontWeight: 600,
                          }}
                        >
                          Name
                        </TableHead>
                        <TableHead
                          style={{
                            color: "rgba(212,175,55,0.8)",
                            fontWeight: 600,
                          }}
                        >
                          Phone
                        </TableHead>
                        <TableHead
                          style={{
                            color: "rgba(212,175,55,0.8)",
                            fontWeight: 600,
                          }}
                        >
                          Principal ID
                        </TableHead>
                        <TableHead
                          style={{
                            color: "rgba(212,175,55,0.8)",
                            fontWeight: 600,
                            width: 120,
                          }}
                        >
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u, i) => {
                        const pid = u.principalId.toString();
                        const isDeleting =
                          deleteUserMutation.isPending &&
                          deleteUserMutation.variables === pid;
                        const isConfirming = confirmDeleteUser === pid;
                        return (
                          <TableRow
                            key={pid}
                            data-ocid={`admin_panel.users.row.${i + 1}`}
                            style={{
                              borderBottom: "1px solid rgba(255,255,255,0.05)",
                              opacity: isDeleting ? 0.5 : 1,
                              transition: "opacity 0.2s",
                            }}
                          >
                            <TableCell
                              style={{
                                color: "rgba(255,255,255,0.4)",
                                fontSize: "0.82rem",
                              }}
                            >
                              {i + 1}
                            </TableCell>
                            <TableCell
                              style={{ fontWeight: 600, color: "#fff" }}
                            >
                              {u.name}
                            </TableCell>
                            <TableCell
                              style={{
                                color: "rgba(255,255,255,0.7)",
                                fontFamily: "monospace",
                                fontSize: "0.82rem",
                              }}
                            >
                              {u.phone}
                            </TableCell>
                            <TableCell
                              style={{
                                color: "rgba(255,255,255,0.4)",
                                fontFamily: "monospace",
                                fontSize: "0.7rem",
                              }}
                            >
                              {pid.slice(0, 16)}…
                            </TableCell>
                            <TableCell>
                              {isDeleting ? (
                                <div
                                  data-ocid={`admin_panel.users.loading_state.${i + 1}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    color: "rgba(255,255,255,0.4)",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  <Loader2 size={13} className="animate-spin" />
                                  Deleting…
                                </div>
                              ) : isConfirming ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.72rem",
                                      color: "rgba(255,180,180,0.9)",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Confirm?
                                  </span>
                                  <button
                                    type="button"
                                    data-ocid={`admin_panel.users.confirm_button.${i + 1}`}
                                    onClick={() =>
                                      deleteUserMutation.mutate(pid)
                                    }
                                    style={{
                                      background: "rgba(220,50,50,0.85)",
                                      border: "none",
                                      borderRadius: 5,
                                      color: "#fff",
                                      fontSize: "0.7rem",
                                      fontWeight: 700,
                                      padding: "2px 8px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    data-ocid={`admin_panel.users.cancel_button.${i + 1}`}
                                    onClick={() => setConfirmDeleteUser(null)}
                                    style={{
                                      background: "rgba(255,255,255,0.1)",
                                      border: "none",
                                      borderRadius: 5,
                                      color: "rgba(255,255,255,0.6)",
                                      fontSize: "0.7rem",
                                      padding: "2px 8px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  data-ocid={`admin_panel.users.delete_button.${i + 1}`}
                                  onClick={() => setConfirmDeleteUser(pid)}
                                  title="Delete user"
                                  style={{
                                    background: "none",
                                    border: "1px solid rgba(220,50,50,0.3)",
                                    borderRadius: 6,
                                    color: "rgba(220,50,50,0.7)",
                                    cursor: "pointer",
                                    padding: "4px 7px",
                                    display: "flex",
                                    alignItems: "center",
                                    transition: "all 0.15s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                      "rgba(220,50,50,0.15)";
                                    e.currentTarget.style.color =
                                      "rgba(255,80,80,1)";
                                    e.currentTarget.style.borderColor =
                                      "rgba(220,50,50,0.7)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "none";
                                    e.currentTarget.style.color =
                                      "rgba(220,50,50,0.7)";
                                    e.currentTarget.style.borderColor =
                                      "rgba(220,50,50,0.3)";
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </motion.div>
          )}

          {/* LAWYERS TAB */}
          {activeTab === "lawyers" && (
            <motion.div
              key="lawyers"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: 16,
                }}
              >
                <Scale size={18} style={{ color: "oklch(0.72 0.14 78)" }} />
                <h2
                  className="font-display font-bold text-gold"
                  style={{ fontSize: "1.1rem" }}
                >
                  Registered Lawyers
                </h2>
                {lawyers && (
                  <span
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      color: "oklch(0.72 0.14 78)",
                      borderRadius: 9999,
                      padding: "2px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {lawyers.length} total
                  </span>
                )}
              </div>
              {lawyersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
              ) : !lawyers || lawyers.length === 0 ? (
                <div
                  data-ocid="admin_panel.lawyers.empty_state"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  <Scale
                    size={40}
                    style={{ margin: "0 auto 0.75rem", opacity: 0.3 }}
                  />
                  <p>No lawyers registered yet</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {lawyers.map((l, i) => {
                    const pid = l.principalId.toString();
                    const isDeleting =
                      deleteLawyerMutation.isPending &&
                      deleteLawyerMutation.variables === pid;
                    const isConfirming = confirmDeleteLawyer === pid;
                    return (
                      <motion.div
                        key={pid}
                        data-ocid={`admin_panel.lawyers.card.${i + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                          background: "rgba(17,25,55,0.8)",
                          border: "1px solid rgba(212,175,55,0.15)",
                          borderRadius: 14,
                          padding: "1.1rem",
                          position: "relative",
                          opacity: isDeleting ? 0.5 : 1,
                          transition: "opacity 0.2s",
                        }}
                      >
                        {/* Top row: name + badge + delete */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 8,
                            gap: 8,
                          }}
                        >
                          <h3
                            style={{
                              fontWeight: 700,
                              color: "#fff",
                              fontSize: "0.95rem",
                              flex: 1,
                            }}
                          >
                            {l.name}
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <Badge
                              variant="outline"
                              style={{
                                fontSize: "0.7rem",
                                color: "oklch(0.72 0.14 78)",
                                borderColor: "rgba(212,175,55,0.4)",
                              }}
                            >
                              {l.specialization}
                            </Badge>
                            {isDeleting ? (
                              <div
                                data-ocid={`admin_panel.lawyers.loading_state.${i + 1}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: "rgba(255,255,255,0.4)",
                                }}
                              >
                                <Loader2 size={13} className="animate-spin" />
                              </div>
                            ) : isConfirming ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    color: "rgba(255,180,180,0.9)",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Delete?
                                </span>
                                <button
                                  type="button"
                                  data-ocid={`admin_panel.lawyers.confirm_button.${i + 1}`}
                                  onClick={() =>
                                    deleteLawyerMutation.mutate(pid)
                                  }
                                  style={{
                                    background: "rgba(220,50,50,0.85)",
                                    border: "none",
                                    borderRadius: 5,
                                    color: "#fff",
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    padding: "2px 7px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  data-ocid={`admin_panel.lawyers.cancel_button.${i + 1}`}
                                  onClick={() => setConfirmDeleteLawyer(null)}
                                  style={{
                                    background: "rgba(255,255,255,0.1)",
                                    border: "none",
                                    borderRadius: 5,
                                    color: "rgba(255,255,255,0.6)",
                                    fontSize: "0.68rem",
                                    padding: "2px 7px",
                                    cursor: "pointer",
                                  }}
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                data-ocid={`admin_panel.lawyers.delete_button.${i + 1}`}
                                onClick={() => setConfirmDeleteLawyer(pid)}
                                title="Delete lawyer"
                                style={{
                                  background: "none",
                                  border: "1px solid rgba(220,50,50,0.3)",
                                  borderRadius: 6,
                                  color: "rgba(220,50,50,0.7)",
                                  cursor: "pointer",
                                  padding: "4px 7px",
                                  display: "flex",
                                  alignItems: "center",
                                  transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background =
                                    "rgba(220,50,50,0.15)";
                                  e.currentTarget.style.color =
                                    "rgba(255,80,80,1)";
                                  e.currentTarget.style.borderColor =
                                    "rgba(220,50,50,0.7)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "none";
                                  e.currentTarget.style.color =
                                    "rgba(220,50,50,0.7)";
                                  e.currentTarget.style.borderColor =
                                    "rgba(220,50,50,0.3)";
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            📞 {l.phone}
                          </span>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            🏛 {l.barNumber}
                          </span>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            📍 {l.location}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* FEEDBACK TAB */}
          {activeTab === "feedback" && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: 16,
                }}
              >
                <MessageSquare
                  size={18}
                  style={{ color: "oklch(0.72 0.14 78)" }}
                />
                <h2
                  className="font-display font-bold text-gold"
                  style={{ fontSize: "1.1rem" }}
                >
                  User Feedback
                </h2>
                {feedbackList && (
                  <span
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      color: "oklch(0.72 0.14 78)",
                      borderRadius: 9999,
                      padding: "2px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {feedbackList.length} reviews
                  </span>
                )}
              </div>
              {feedbackLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              ) : !feedbackList || feedbackList.length === 0 ? (
                <div
                  data-ocid="admin_panel.feedback.empty_state"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  <MessageSquare
                    size={40}
                    style={{ margin: "0 auto 0.75rem", opacity: 0.3 }}
                  />
                  <p>No feedback submitted yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {feedbackList.map((fb, i) => (
                    <motion.div
                      key={`fb-${i}-${String(fb.timestamp)}`}
                      data-ocid={`admin_panel.feedback.item.${i + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        background: "rgba(17,25,55,0.8)",
                        border: "1px solid rgba(212,175,55,0.15)",
                        borderRadius: 14,
                        padding: "1.1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <div style={{ display: "flex", gap: 3 }}>
                          {[1, 2, 3, 4, 5].map((sn) => (
                            <Star
                              key={sn}
                              size={14}
                              style={{
                                color:
                                  sn <= Number(fb.rating)
                                    ? "oklch(0.72 0.14 78)"
                                    : "rgba(255,255,255,0.2)",
                                fill:
                                  sn <= Number(fb.rating)
                                    ? "oklch(0.72 0.14 78)"
                                    : "transparent",
                              }}
                            />
                          ))}
                        </div>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          {formatDate(fb.timestamp)}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.75)",
                          lineHeight: 1.5,
                        }}
                      >
                        {fb.comment || "No comment provided"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* CASES TAB */}
          {activeTab === "cases" && (
            <motion.div
              key="cases"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: 16,
                }}
              >
                <Shield size={18} style={{ color: "oklch(0.72 0.14 78)" }} />
                <h2
                  className="font-display font-bold text-gold"
                  style={{ fontSize: "1.1rem" }}
                >
                  All Cases
                </h2>
                {cases && (
                  <span
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      color: "oklch(0.72 0.14 78)",
                      borderRadius: 9999,
                      padding: "2px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {cases.length} total
                  </span>
                )}
              </div>
              {casesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
              ) : !cases || cases.length === 0 ? (
                <div
                  data-ocid="admin_panel.cases.empty_state"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  <Shield
                    size={40}
                    style={{ margin: "0 auto 0.75rem", opacity: 0.3 }}
                  />
                  <p>No cases submitted yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cases.map((c, i) => {
                    const st = STATUS_STYLES[c.status as string] ?? {
                      bg: "rgba(255,255,255,0.1)",
                      text: "#fff",
                    };
                    return (
                      <motion.div
                        key={c.id.toString()}
                        data-ocid={`admin_panel.cases.item.${i + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        style={{
                          background: "rgba(17,25,55,0.8)",
                          border: "1px solid rgba(212,175,55,0.15)",
                          borderRadius: 14,
                          padding: "1.1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                            gap: 8,
                          }}
                        >
                          <h3
                            style={{
                              fontWeight: 600,
                              fontSize: "0.9rem",
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
                              fontSize: "0.7rem",
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
                            gap: "0.75rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <Badge
                            variant="outline"
                            style={{
                              fontSize: "0.7rem",
                              color: "rgba(255,255,255,0.7)",
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
                            {formatDate(c.createdDate)}
                          </span>
                          {c.assignedLawyer && (
                            <span
                              style={{ fontSize: "0.72rem", color: "#93c5fd" }}
                            >
                              Assigned
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
          {activeTab === "logins" && (
            <motion.div
              key="logins"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <Clock size={20} style={{ color: "rgba(212,175,55,0.9)" }} />
                <h2
                  style={{
                    color: "rgba(212,175,55,0.9)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Login History
                </h2>
                {loginRecords && (
                  <span
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      color: "rgba(212,175,55,0.9)",
                      borderRadius: "999px",
                      padding: "0.15rem 0.7rem",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                    }}
                  >
                    {loginRecords.length} total
                  </span>
                )}
              </div>
              {loginRecordsLoading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      style={{
                        height: "72px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.06)",
                      }}
                    />
                  ))}
                </div>
              ) : !loginRecords || loginRecords.length === 0 ? (
                <div
                  data-ocid="admin_panel.logins.empty_state"
                  style={{
                    textAlign: "center",
                    padding: "3rem 1rem",
                    color: "rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "16px",
                    border: "1px dashed rgba(212,175,55,0.2)",
                  }}
                >
                  <Clock
                    size={40}
                    style={{ margin: "0 auto 1rem", opacity: 0.3 }}
                  />
                  <p>No login records yet</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {[...loginRecords].reverse().map((lr: any, i: number) => (
                    <div
                      key={`${lr.phone}-${lr.timestamp}-${i}`}
                      data-ocid={`admin_panel.logins.item.${i + 1}`}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(212,175,55,0.15)",
                        borderRadius: "12px",
                        padding: "1rem 1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "rgba(212,175,55,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Clock
                          size={18}
                          style={{ color: "rgba(212,175,55,0.8)" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              color: "rgba(212,175,55,0.95)",
                              fontWeight: 700,
                              fontSize: "0.95rem",
                            }}
                          >
                            {lr.name}
                          </span>
                          <span
                            style={{
                              background:
                                lr.role === "lawyer"
                                  ? "rgba(147,51,234,0.2)"
                                  : "rgba(59,130,246,0.2)",
                              color:
                                lr.role === "lawyer"
                                  ? "rgba(196,148,255,0.9)"
                                  : "rgba(147,197,253,0.9)",
                              border: `1px solid ${lr.role === "lawyer" ? "rgba(147,51,234,0.4)" : "rgba(59,130,246,0.4)"}`,
                              borderRadius: "999px",
                              padding: "0.1rem 0.6rem",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {lr.role === "lawyer" ? "Lawyer" : "User"}
                          </span>
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.55)",
                            fontSize: "0.82rem",
                            marginTop: "0.2rem",
                          }}
                        >
                          {lr.phone}
                        </div>
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: "0.78rem",
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {formatDate(lr.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "chatbot" && (
            <motion.div
              key="chatbot"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Bot size={20} style={{ color: "rgba(212,175,55,0.9)" }} />
                  <h2
                    style={{
                      color: "rgba(212,175,55,0.9)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    Chatbot Responses
                  </h2>
                  {chatbotEntries && (
                    <span
                      style={{
                        background: "rgba(212,175,55,0.15)",
                        color: "rgba(212,175,55,0.9)",
                        borderRadius: "999px",
                        padding: "0.15rem 0.7rem",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                      }}
                    >
                      {chatbotEntries.length} topics
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  data-ocid="admin_panel.chatbot.reset.button"
                  onClick={() => setConfirmReset(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "rgba(252,165,165,0.8)",
                    borderRadius: "8px",
                    padding: "0.45rem 0.9rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <RotateCcw size={14} /> Reset to Defaults
                </button>
              </div>

              {chatbotLoading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      style={{
                        height: "80px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.06)",
                      }}
                    />
                  ))}
                </div>
              ) : !chatbotEntries || chatbotEntries.length === 0 ? (
                <div
                  data-ocid="admin_panel.chatbot.empty_state"
                  style={{
                    textAlign: "center",
                    padding: "3rem 1rem",
                    color: "rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "16px",
                    border: "1px dashed rgba(212,175,55,0.2)",
                  }}
                >
                  <Bot
                    size={40}
                    style={{ margin: "0 auto 1rem", opacity: 0.3 }}
                  />
                  <p>No chatbot entries found</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {chatbotEntries.map((entry, i) => (
                    <div
                      key={entry.topicKey}
                      data-ocid={`admin_panel.chatbot.item.${i + 1}`}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(212,175,55,0.15)",
                        borderRadius: "12px",
                        padding: "1rem 1.25rem",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.8rem",
                          flexShrink: 0,
                          lineHeight: 1,
                        }}
                      >
                        {entry.icon}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            flexWrap: "wrap",
                            marginBottom: "0.4rem",
                          }}
                        >
                          <span
                            style={{
                              color: "rgba(212,175,55,0.95)",
                              fontWeight: 700,
                              fontSize: "0.95rem",
                            }}
                          >
                            {entry.title}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.3rem",
                          }}
                        >
                          {entry.keywords.map((kw) => (
                            <span
                              key={kw}
                              style={{
                                background: "rgba(212,175,55,0.1)",
                                border: "1px solid rgba(212,175,55,0.2)",
                                color: "rgba(212,175,55,0.7)",
                                borderRadius: "9999px",
                                padding: "0.1rem 0.55rem",
                                fontSize: "0.72rem",
                              }}
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.8rem",
                            marginTop: "0.35rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {entry.intro}
                        </p>
                      </div>
                      <button
                        type="button"
                        data-ocid={`admin_panel.chatbot.edit_button.${i + 1}`}
                        onClick={() => openEdit(entry)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          background: "rgba(212,175,55,0.1)",
                          border: "1px solid rgba(212,175,55,0.25)",
                          color: "rgba(212,175,55,0.8)",
                          borderRadius: "8px",
                          padding: "0.4rem 0.75rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Edit Modal */}
              <Dialog
                open={!!editingEntry}
                onOpenChange={(open) => {
                  if (!open) {
                    setEditingEntry(null);
                    setEditForm(null);
                  }
                }}
              >
                <DialogContent
                  style={{
                    background: "#0d1530",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: "16px",
                    maxWidth: "560px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                  }}
                >
                  <DialogHeader>
                    <DialogTitle
                      style={{
                        color: "rgba(212,175,55,0.95)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>{editingEntry?.icon}</span>
                      <span>Edit: {editingEntry?.title}</span>
                    </DialogTitle>
                  </DialogHeader>
                  {editForm && editingEntry && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        paddingTop: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: "10px",
                          padding: "0.75rem 1rem",
                        }}
                      >
                        <p
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            marginBottom: "0.3rem",
                          }}
                        >
                          Topic Key (read-only)
                        </p>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {editingEntry.topicKey}
                        </p>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            margin: "0.5rem 0 0.3rem",
                          }}
                        >
                          Keywords (read-only)
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.3rem",
                          }}
                        >
                          {editingEntry.keywords.map((kw) => (
                            <span
                              key={kw}
                              style={{
                                background: "rgba(212,175,55,0.1)",
                                border: "1px solid rgba(212,175,55,0.2)",
                                color: "rgba(212,175,55,0.7)",
                                borderRadius: "9999px",
                                padding: "0.1rem 0.55rem",
                                fontSize: "0.72rem",
                              }}
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {[
                        {
                          key: "intro",
                          label: "Intro",
                          type: "textarea",
                          rows: 3,
                        },
                        {
                          key: "whatToDo",
                          label: "What to Do",
                          type: "textarea",
                          rows: 3,
                        },
                        {
                          key: "documents",
                          label: "Documents (comma-separated)",
                          type: "input",
                        },
                        {
                          key: "lawyerType",
                          label: "Lawyer Type",
                          type: "input",
                        },
                        { key: "cost", label: "Cost", type: "input" },
                        {
                          key: "timeRequired",
                          label: "Time Required",
                          type: "input",
                        },
                        {
                          key: "successRate",
                          label: "Success Rate",
                          type: "input",
                        },
                        { key: "tip", label: "Tip", type: "textarea", rows: 2 },
                      ].map(({ key, label, type, rows }) => (
                        <div key={key}>
                          <p
                            style={{
                              color: "rgba(255,255,255,0.6)",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              display: "block",
                              margin: "0 0 0.3rem",
                            }}
                          >
                            {label}
                          </p>
                          {type === "textarea" ? (
                            <Textarea
                              data-ocid={`admin_panel.chatbot.edit.${key}.textarea`}
                              value={editForm[key as keyof typeof editForm]}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev
                                    ? { ...prev, [key]: e.target.value }
                                    : null,
                                )
                              }
                              rows={rows}
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(212,175,55,0.2)",
                                color: "white",
                                borderRadius: "8px",
                                fontSize: "0.85rem",
                              }}
                            />
                          ) : (
                            <Input
                              data-ocid={`admin_panel.chatbot.edit.${key}.input`}
                              value={editForm[key as keyof typeof editForm]}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev
                                    ? { ...prev, [key]: e.target.value }
                                    : null,
                                )
                              }
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(212,175,55,0.2)",
                                color: "white",
                                borderRadius: "8px",
                                fontSize: "0.85rem",
                              }}
                            />
                          )}
                        </div>
                      ))}

                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          justifyContent: "flex-end",
                          paddingTop: "0.5rem",
                        }}
                      >
                        <Button
                          data-ocid="admin_panel.chatbot.edit.cancel_button"
                          type="button"
                          onClick={() => {
                            setEditingEntry(null);
                            setEditForm(null);
                          }}
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.6)",
                            borderRadius: "8px",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          data-ocid="admin_panel.chatbot.edit.save_button"
                          type="button"
                          disabled={updateChatbotMutation.isPending}
                          onClick={() => {
                            if (!editForm || !editingEntry) return;
                            updateChatbotMutation.mutate({
                              id: editingEntry.id,
                              intro: editForm.intro,
                              whatToDo: editForm.whatToDo,
                              documents: editForm.documents
                                .split(",")
                                .map((d) => d.trim())
                                .filter(Boolean),
                              lawyerType: editForm.lawyerType,
                              cost: editForm.cost,
                              timeRequired: editForm.timeRequired,
                              successRate: editForm.successRate,
                              tip: editForm.tip,
                            });
                          }}
                          style={{
                            background: "rgba(212,175,55,0.9)",
                            color: "#0a0f1e",
                            borderRadius: "8px",
                            fontWeight: 700,
                          }}
                        >
                          {updateChatbotMutation.isPending ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : null}
                          {updateChatbotMutation.isPending
                            ? "Saving..."
                            : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Reset Confirm Dialog */}
              <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
                <DialogContent
                  style={{
                    background: "#0d1530",
                    border: "1px solid rgba(239,68,68,0.35)",
                    borderRadius: "16px",
                    maxWidth: "400px",
                  }}
                >
                  <DialogHeader>
                    <DialogTitle style={{ color: "rgba(252,165,165,0.9)" }}>
                      Reset to Defaults?
                    </DialogTitle>
                  </DialogHeader>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                  >
                    This will reset all chatbot responses to their original
                    default values. This cannot be undone.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      justifyContent: "flex-end",
                      paddingTop: "0.5rem",
                    }}
                  >
                    <Button
                      data-ocid="admin_panel.chatbot.reset.cancel_button"
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.6)",
                        borderRadius: "8px",
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      data-ocid="admin_panel.chatbot.reset.confirm_button"
                      type="button"
                      disabled={resetChatbotMutation.isPending}
                      onClick={() => resetChatbotMutation.mutate()}
                      style={{
                        background: "rgba(239,68,68,0.8)",
                        color: "white",
                        borderRadius: "8px",
                        fontWeight: 700,
                      }}
                    >
                      {resetChatbotMutation.isPending ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : null}
                      {resetChatbotMutation.isPending
                        ? "Resetting..."
                        : "Yes, Reset"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export function AdminScreen({ onLogout }: AdminScreenProps) {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <AdminLogin onAuthenticate={() => setAuthenticated(true)} />;
  }

  return <AdminPanel onLogout={onLogout} />;
}
