import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

// ─── Logo ────────────────────────────────────────────────────────────────────
function VakyomLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="19" stroke="#D8B56E" strokeWidth="1.5" />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#D8B56E"
          fontFamily="serif"
        >
          V
        </text>
        <line
          x1="10"
          y1="30"
          x2="30"
          y2="30"
          stroke="#D8B56E"
          strokeWidth="1.5"
        />
        <line
          x1="20"
          y1="26"
          x2="12"
          y2="22"
          stroke="#D8B56E"
          strokeWidth="1"
        />
        <line
          x1="20"
          y1="26"
          x2="28"
          y2="22"
          stroke="#D8B56E"
          strokeWidth="1"
        />
        <rect
          x="10"
          y="20"
          width="4"
          height="3"
          rx="1"
          fill="#D8B56E"
          opacity="0.7"
        />
        <rect
          x="26"
          y="20"
          width="4"
          height="3"
          rx="1"
          fill="#D8B56E"
          opacity="0.7"
        />
      </svg>
      <span
        style={{
          background: "linear-gradient(135deg, #E6CC8A, #D8B56E)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontWeight: 700,
          fontSize: size * 0.55,
          letterSpacing: "0.05em",
        }}
      >
        Vakyom
      </span>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Solutions", href: "#features" },
    { label: "Product", href: "#walkthrough" },
    { label: "How It Works", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(6,11,26,0.95)" : "rgba(6,11,26,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        transition: "background 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <VakyomLogo size={34} />
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                color: "#A9B4CF",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "#E6CC8A")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "#A9B4CF")
              }
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#early-access"
            style={{
              color: "#A9B4CF",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Login
          </a>
          <a
            href="#early-access"
            style={{
              background: "linear-gradient(135deg, #D8B56E, #B99243)",
              color: "#060B1A",
              padding: "8px 20px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(216,181,110,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "scale(1)";
            }}
          >
            Request Demo
          </a>
        </div>
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            color: "#EAF0FF",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {menuOpen && (
        <div
          style={{
            background: "rgba(6,11,26,0.98)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#EAF0FF",
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#early-access"
            onClick={() => setMenuOpen(false)}
            style={{
              background: "linear-gradient(135deg, #D8B56E, #B99243)",
              color: "#060B1A",
              padding: "10px 20px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Request Demo
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #060B1A 0%, #070D1F 60%, #030611 100%)",
      }}
    >
      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#D8B56E",
            opacity: 0.4,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {/* Gold radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "-10%",
          width: "70%",
          height: "80%",
          background:
            "radial-gradient(ellipse, rgba(201,163,90,0.1) 0%, transparent 65%)",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 24px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
        className="grid-cols-1 md:grid-cols-2"
      >
        {/* Left */}
        <div style={{ zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(216,181,110,0.1)",
              border: "1px solid rgba(216,181,110,0.3)",
              borderRadius: 999,
              padding: "6px 16px",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 12, color: "#D8B56E", fontWeight: 600 }}>
              🚀 Now in Early Access
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.08,
              marginBottom: 24,
              background:
                "linear-gradient(135deg, #E6CC8A 0%, #D8B56E 50%, #B99243 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Reimagining Legal Workflows in India
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "#A9B4CF",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 520,
            }}
          >
            From AI-powered drafting to real-time case tracking — Vakyom
            transforms how lawyers work, how clients stay informed, and how
            people understand law.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="#walkthrough"
              style={{
                background: "linear-gradient(135deg, #D8B56E, #B99243)",
                color: "#060B1A",
                padding: "14px 28px",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(216,181,110,0.35)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1.04)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1)")
              }
            >
              Launch Demo Experience
            </a>
            <a
              href="#early-access"
              style={{
                background: "transparent",
                color: "#EAF0FF",
                padding: "14px 28px",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "#D8B56E")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.2)")
              }
            >
              Join Early Access
            </a>
          </div>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {[
              "✓ BCI Compliant",
              "✓ End-to-End Encrypted",
              "✓ 12 Indian Languages",
            ].map((t) => (
              <span
                key={t}
                style={{ fontSize: 13, color: "#8F9AB6", fontWeight: 500 }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        {/* Right floating cards */}
        <div
          style={{
            position: "relative",
            height: 420,
            display: "flex",
            justifyContent: "center",
          }}
          className="hidden md:block"
        >
          <div
            className="float-1 glass-card"
            style={{
              position: "absolute",
              top: 20,
              right: 0,
              width: 240,
              borderRadius: 16,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#8F9AB6",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              ⚖️ Active Cases
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#EAF0FF",
                marginBottom: 10,
              }}
            >
              24
            </div>
            <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
              {[40, 55, 35, 65, 50, 72, 60].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: h * 0.6,
                    background:
                      i === 6
                        ? "linear-gradient(#E6CC8A,#B99243)"
                        : "rgba(216,181,110,0.3)",
                    borderRadius: 3,
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#8F9AB6", marginTop: 8 }}>
              Cases tracked this month
            </div>
          </div>
          <div
            className="float-2 glass-card"
            style={{
              position: "absolute",
              top: "45%",
              left: 10,
              width: 260,
              borderRadius: 16,
              padding: "16px 18px",
              borderColor: "rgba(216,181,110,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "rgba(216,181,110,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🤖
              </div>
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#EAF0FF" }}
                >
                  AI Draft Ready
                </div>
                <div style={{ fontSize: 11, color: "#D8B56E" }}>
                  ✓ Generated in 3.2s
                </div>
              </div>
            </div>
            <div
              style={{
                background: "rgba(216,181,110,0.07)",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 11,
                color: "#8F9AB6",
                lineHeight: 1.5,
              }}
            >
              Legal Notice to M/s Sharma Builders... Re: Possession of Flat No.
              304...
            </div>
          </div>
          <div
            className="float-3 glass-card"
            style={{
              position: "absolute",
              bottom: 30,
              right: 20,
              width: 220,
              borderRadius: 16,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 18 }}>🔔</span>
              <span
                style={{
                  fontSize: 11,
                  background: "rgba(239,68,68,0.15)",
                  color: "#f87171",
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontWeight: 600,
                }}
              >
                Tomorrow
              </span>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#EAF0FF",
                marginBottom: 4,
              }}
            >
              Hearing: Sharma vs State
            </div>
            <div style={{ fontSize: 11, color: "#8F9AB6" }}>
              Court Room 3 · 10:30 AM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Walkthrough ──────────────────────────────────────────────────────────────
function WalkthroughSection() {
  const [aiText, setAiText] = useState("");
  const [showTyping, setShowTyping] = useState(true);
  const [lang, setLang] = useState("Hindi");
  const [uploadStage, setUploadStage] = useState(0);
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const fullText =
    "Sampatti vivad ke liye pehle apne documents ikatthe karein — Sale Deed, EC Certificate aur Property Tax Receipts. Phir local Civil Court mein declaration aur injunction ke liye civil suit file karein. Ek Civil/Property lawyer se consult zaroor karein. Estimated cost: ₹20,000 – ₹2,00,000.";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(false);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setAiText(fullText.slice(0, i * 3));
        if (i * 3 >= fullText.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpload = () => {
    setUploadStage(1);
    setTimeout(() => setUploadStage(2), 2500);
  };

  return (
    <section
      id="walkthrough"
      style={{
        padding: "96px 24px",
        background: "linear-gradient(180deg, #060B1A 0%, #0B1430 100%)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="fade-section"
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              color: "#EAF0FF",
              marginBottom: 12,
            }}
          >
            Interactive Product Walkthrough
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "#8F9AB6",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Experience Vakyom from every perspective
          </p>
        </div>
        <Tabs defaultValue="public" className="fade-section">
          <TabsList
            style={{
              background: "rgba(16,24,47,0.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999,
              padding: "4px",
              display: "flex",
              gap: 4,
              width: "fit-content",
              margin: "0 auto 36px",
            }}
          >
            {["public", "client", "lawyer"].map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                style={{
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "8px 20px",
                }}
              >
                {t === "public"
                  ? "👤 Public User"
                  : t === "client"
                    ? "👥 Client"
                    : "⚖️ Lawyer"}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* PUBLIC USER */}
          <TabsContent value="public">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
              className="grid-cols-1 md:grid-cols-2"
            >
              <div
                className="glass-card"
                style={{
                  borderRadius: 20,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Kannada", "Hindi", "Tamil", "English"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      style={{
                        padding: "5px 14px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        border: "1px solid",
                        cursor: "pointer",
                        background:
                          lang === l ? "rgba(216,181,110,0.2)" : "transparent",
                        borderColor:
                          lang === l ? "#D8B56E" : "rgba(255,255,255,0.15)",
                        color: lang === l ? "#D8B56E" : "#8F9AB6",
                        transition: "all 0.2s",
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #D8B56E, #B99243)",
                        color: "#060B1A",
                        padding: "10px 16px",
                        borderRadius: "18px 18px 4px 18px",
                        fontSize: 13,
                        fontWeight: 600,
                        maxWidth: "75%",
                      }}
                    >
                      Property dispute kya kare?
                    </div>
                  </div>
                  {showTyping ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        padding: "12px 14px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "4px 18px 18px 18px",
                        width: 60,
                      }}
                    >
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "4px 18px 18px 18px",
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#EAF0FF",
                        lineHeight: 1.6,
                        maxWidth: "85%",
                      }}
                    >
                      🤖{" "}
                      <strong style={{ color: "#D8B56E" }}>Vakyom AI:</strong>{" "}
                      {aiText}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 999,
                    padding: "10px 16px",
                    fontSize: 13,
                    color: "#4A5568",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Ask your legal question...
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {[
                  {
                    icon: "🏛️",
                    title: "Know Your Rights",
                    desc: "Understand fundamental rights every Indian citizen has under the Constitution",
                  },
                  {
                    icon: "🏠",
                    title: "Property Laws",
                    desc: "Navigate land ownership, registration, and dispute resolution in India",
                  },
                  {
                    icon: "⚖️",
                    title: "Consumer Rights",
                    desc: "File complaints and seek redressal for defective products or services",
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="glass-card-light"
                    style={{
                      borderRadius: 14,
                      padding: "16px 18px",
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(216,181,110,0.3)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(255,255,255,0.08)")
                    }
                  >
                    <span style={{ fontSize: 22 }}>{card.icon}</span>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#EAF0FF",
                          marginBottom: 4,
                        }}
                      >
                        {card.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#8F9AB6",
                          lineHeight: 1.5,
                        }}
                      >
                        {card.desc}
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#D8B56E",
                          marginTop: 6,
                          display: "block",
                        }}
                      >
                        Learn More →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* CLIENT */}
          <TabsContent value="client">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
              className="grid-cols-1 md:grid-cols-2"
            >
              <div
                className="glass-card"
                style={{ borderRadius: 20, padding: 24 }}
              >
                <div
                  style={{
                    background: "rgba(251,191,36,0.1)",
                    border: "1px solid rgba(251,191,36,0.3)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    marginBottom: 20,
                    fontSize: 13,
                    color: "#FCD34D",
                  }}
                >
                  🔔 Your hearing is scheduled{" "}
                  <strong>tomorrow at 10:30 AM</strong>, Court Room 3
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "#EAF0FF" }}
                  >
                    Sharma Family Property Case
                  </span>
                  <span
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      color: "#4ADE80",
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Active
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 0 }}
                >
                  {[
                    { label: "Case Filed", date: "Jan 15", done: true },
                    {
                      label: "Documents Submitted",
                      date: "Jan 20",
                      done: true,
                    },
                    {
                      label: "Hearing Scheduled",
                      date: "Feb 12",
                      active: true,
                    },
                    { label: "Resolution", date: "TBD", done: false },
                  ].map((step, i, arr) => (
                    <div
                      key={step.label}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className={step.active ? "active-ring" : ""}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: step.done
                              ? "#4ADE80"
                              : step.active
                                ? "#D8B56E"
                                : "rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            flexShrink: 0,
                          }}
                        >
                          {step.done ? "✓" : step.active ? "●" : ""}
                        </div>
                        {i < arr.length - 1 && (
                          <div
                            style={{
                              width: 2,
                              height: 28,
                              background: step.done
                                ? "#4ADE80"
                                : "rgba(255,255,255,0.1)",
                              margin: "2px 0",
                            }}
                          />
                        )}
                      </div>
                      <div style={{ paddingBottom: 12 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: step.active ? 600 : 400,
                            color: step.active
                              ? "#D8B56E"
                              : step.done
                                ? "#EAF0FF"
                                : "#4A5568",
                          }}
                        >
                          {step.label}
                        </div>
                        <div style={{ fontSize: 11, color: "#4A5568" }}>
                          {step.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div
                  className="glass-card"
                  style={{ borderRadius: 16, padding: 20 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#EAF0FF",
                      }}
                    >
                      📄 Property Deed.pdf
                    </span>
                    <span style={{ fontSize: 11, color: "#4ADE80" }}>
                      Verified
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      marginBottom: 14,
                    }}
                  >
                    {[90, 70, 85, 60, 75].map((w, i) => (
                      <div
                        key={i}
                        style={{
                          height: 8,
                          background: "rgba(255,255,255,0.07)",
                          borderRadius: 4,
                          width: `${w}%`,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={{
                        flex: 1,
                        background: "rgba(216,181,110,0.1)",
                        border: "1px solid rgba(216,181,110,0.3)",
                        color: "#D8B56E",
                        borderRadius: 8,
                        padding: "8px",
                        fontSize: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      📄 View Document
                    </button>
                    <button
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#A9B4CF",
                        borderRadius: 8,
                        padding: "8px",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      🌐 Translate
                    </button>
                  </div>
                </div>
                <div
                  className="glass-card"
                  style={{ borderRadius: 16, padding: 20 }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#EAF0FF",
                      marginBottom: 12,
                    }}
                  >
                    Recent Messages
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#A9B4CF" }}>
                      <strong style={{ color: "#D8B56E" }}>
                        Advocate Priya:
                      </strong>{" "}
                      All documents received. Court date confirmed for Feb 12.
                    </div>
                    <div style={{ fontSize: 12, color: "#A9B4CF" }}>
                      <strong style={{ color: "#EAF0FF" }}>You:</strong> Thank
                      you, please keep me updated on any changes.
                    </div>
                  </div>
                  <button
                    style={{
                      marginTop: 14,
                      width: "100%",
                      background: "linear-gradient(135deg, #D8B56E, #B99243)",
                      border: "none",
                      color: "#060B1A",
                      borderRadius: 8,
                      padding: "10px",
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Open Chat →
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* LAWYER */}
          <TabsContent value="lawyer">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.6fr 1fr",
                gap: 16,
              }}
              className="grid-cols-1 md:grid-cols-3"
            >
              {/* Case list */}
              <div
                className="glass-card"
                style={{ borderRadius: 16, padding: 18 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#EAF0FF" }}
                  >
                    My Cases
                  </span>
                  <span
                    style={{
                      background: "rgba(216,181,110,0.15)",
                      color: "#D8B56E",
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    3
                  </span>
                </div>
                {[
                  {
                    name: "Sharma vs State",
                    status: "Active",
                    color: "#D8B56E",
                    bg: "rgba(216,181,110,0.1)",
                  },
                  {
                    name: "Patel Property Case",
                    status: "Hearing",
                    color: "#60A5FA",
                    bg: "rgba(96,165,250,0.1)",
                  },
                  {
                    name: "Consumer Complaint #44",
                    status: "Pending",
                    color: "#9CA3AF",
                    bg: "rgba(156,163,175,0.1)",
                  },
                ].map((c) => (
                  <div
                    key={c.name}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      marginBottom: 8,
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.06)",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(216,181,110,0.3)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(255,255,255,0.06)")
                    }
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#EAF0FF",
                        marginBottom: 5,
                      }}
                    >
                      {c.name}
                    </div>
                    <span
                      style={{
                        background: c.bg,
                        color: c.color,
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Document workspace */}
              <div
                className="glass-card"
                style={{ borderRadius: 16, padding: 18 }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#EAF0FF",
                    marginBottom: 14,
                  }}
                >
                  Document Workspace
                </div>
                {uploadStage === 0 && (
                  <div
                    onClick={handleUpload}
                    style={{
                      border: "2px dashed rgba(216,181,110,0.3)",
                      borderRadius: 12,
                      padding: "32px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(216,181,110,0.6)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(216,181,110,0.3)")
                    }
                  >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>📤</div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#A9B4CF",
                        marginBottom: 6,
                      }}
                    >
                      Drop legal documents here or click to upload
                    </div>
                    <div style={{ fontSize: 11, color: "#4A5568" }}>
                      PDF, DOCX, Images supported
                    </div>
                  </div>
                )}
                {uploadStage === 1 && (
                  <div style={{ textAlign: "center", padding: "32px 20px" }}>
                    <div
                      className="spin-slow"
                      style={{
                        fontSize: 32,
                        display: "inline-block",
                        marginBottom: 12,
                      }}
                    >
                      ⚙️
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#D8B56E",
                        fontWeight: 600,
                      }}
                    >
                      Processing with Deep Legal OCR...
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#8F9AB6", marginTop: 6 }}
                    >
                      Recognizing regional language text
                    </div>
                  </div>
                )}
                {uploadStage === 2 && (
                  <div>
                    <div
                      style={{
                        background: "rgba(216,181,110,0.06)",
                        borderRadius: 10,
                        padding: "12px 14px",
                        fontSize: 12,
                        color: "#A9B4CF",
                        lineHeight: 1.7,
                        marginBottom: 14,
                      }}
                    >
                      This{" "}
                      <span
                        style={{
                          background: "rgba(216,181,110,0.2)",
                          color: "#D8B56E",
                          padding: "1px 5px",
                          borderRadius: 4,
                        }}
                      >
                        SALE DEED
                      </span>{" "}
                      is executed on 15th January 2024 by M/s Sharma Builders
                      regarding{" "}
                      <span
                        style={{
                          background: "rgba(216,181,110,0.2)",
                          color: "#D8B56E",
                          padding: "1px 5px",
                          borderRadius: 4,
                        }}
                      >
                        PROPERTY RIGHTS
                      </span>{" "}
                      of Flat No. 304. Dispute to be resolved at{" "}
                      <span
                        style={{
                          background: "rgba(216,181,110,0.2)",
                          color: "#D8B56E",
                          padding: "1px 5px",
                          borderRadius: 4,
                        }}
                      >
                        CIVIL COURT
                      </span>{" "}
                      jurisdiction.
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#EAF0FF",
                        marginBottom: 10,
                      }}
                    >
                      ✍️ Generate Legal Notice
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <Input
                        placeholder="Client Name"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        style={{
                          fontSize: 12,
                          height: 36,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#EAF0FF",
                        }}
                      />
                      <Input
                        placeholder="Amount (₹)"
                        value={draftAmount}
                        onChange={(e) => setDraftAmount(e.target.value)}
                        style={{
                          fontSize: 12,
                          height: 36,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#EAF0FF",
                        }}
                      />
                      <Input
                        placeholder="Date"
                        value={draftDate}
                        onChange={(e) => setDraftDate(e.target.value)}
                        style={{
                          fontSize: 12,
                          height: 36,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#EAF0FF",
                        }}
                      />
                      <button
                        onClick={() => setDraftGenerated(true)}
                        style={{
                          background:
                            "linear-gradient(135deg, #D8B56E, #B99243)",
                          border: "none",
                          color: "#060B1A",
                          borderRadius: 8,
                          padding: "10px",
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        Generate Notice
                      </button>
                    </div>
                    {draftGenerated && (
                      <div
                        style={{
                          marginTop: 12,
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: 8,
                          padding: "10px 12px",
                          fontSize: 11,
                          color: "#A9B4CF",
                          lineHeight: 1.6,
                          fontStyle: "italic",
                        }}
                      >
                        LEGAL NOTICE — To: {draftName || "[Client Name]"} — Re:
                        Recovery of ₹{draftAmount || "[Amount]"} — Date:{" "}
                        {draftDate || "[Date]"} — You are hereby called upon to
                        pay the above amount within 15 days from receipt of this
                        notice, failing which legal proceedings will be
                        initiated without further notice.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* AI sidebar */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div
                  className="glass-card"
                  style={{ borderRadius: 14, padding: 16 }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#EAF0FF",
                      marginBottom: 12,
                    }}
                  >
                    🤖 AI Tools
                  </div>
                  {["✍️ Draft", "🔍 Research", "📋 Summarize"].map((tool) => (
                    <button
                      key={tool}
                      style={{
                        display: "block",
                        width: "100%",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#A9B4CF",
                        borderRadius: 8,
                        padding: "9px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                        marginBottom: 8,
                        textAlign: "left",
                        transition: "all 0.2s",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(216,181,110,0.1)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "#D8B56E";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.05)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "#A9B4CF";
                      }}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
                <div
                  className="glass-card"
                  style={{ borderRadius: 14, padding: 16 }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#EAF0FF",
                      marginBottom: 12,
                    }}
                  >
                    🔔 Case Alerts
                  </div>
                  {[
                    {
                      text: "Cause list updated: Sharma vs State",
                      time: "2h ago",
                    },
                    {
                      text: "Order uploaded: Patel Property Case",
                      time: "5h ago",
                    },
                  ].map((a) => (
                    <div
                      key={a.text}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: "#A9B4CF",
                          lineHeight: 1.4,
                        }}
                      >
                        {a.text}
                      </div>
                      <div
                        style={{ fontSize: 10, color: "#4A5568", marginTop: 3 }}
                      >
                        {a.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

// ─── Problem / Solution ───────────────────────────────────────────────────────
function ProblemSolutionSection() {
  return (
    <section
      id="problem-solution"
      style={{ padding: "96px 24px", background: "#060B1A" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="fade-section"
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700,
              color: "#EAF0FF",
              marginBottom: 12,
            }}
          >
            The Legal Industry's Biggest Pain Points — Solved
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 32,
            alignItems: "stretch",
          }}
          className="grid-cols-1 md:grid-cols-3"
        >
          <div
            className="glass-card fade-left"
            style={{
              borderRadius: 20,
              padding: 32,
              borderColor: "rgba(239,68,68,0.2)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 999,
                padding: "5px 14px",
                marginBottom: 24,
                fontSize: 12,
                color: "#f87171",
                fontWeight: 600,
              }}
            >
              Before Vakyom
            </div>
            {[
              {
                icon: "❌",
                title: "Drowning in manual paperwork",
                desc: "Hours spent organizing case files, notices, and filings by hand",
              },
              {
                icon: "❌",
                title: "Critical deadlines missed",
                desc: "No automated system to track court dates and hearing schedules",
              },
              {
                icon: "❌",
                title: "Unreadable scanned docs",
                desc: "Poor quality scans of regional language documents cause delays",
              },
              {
                icon: "❌",
                title: "Clients left in the dark",
                desc: "No system to keep clients informed of their case progress",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{ display: "flex", gap: 12, marginBottom: 20 }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#f87171",
                      marginBottom: 3,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#8F9AB6", lineHeight: 1.5 }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Divider */}
          <div
            className="hidden md:flex"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div
              style={{
                width: 2,
                height: "100%",
                background:
                  "linear-gradient(to bottom, transparent, #D8B56E, transparent)",
                boxShadow: "0 0 20px rgba(216,181,110,0.4)",
              }}
            />
          </div>
          <div
            className="glass-card fade-right"
            style={{
              borderRadius: 20,
              padding: 32,
              borderColor: "rgba(216,181,110,0.25)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(216,181,110,0.12)",
                border: "1px solid rgba(216,181,110,0.3)",
                borderRadius: 999,
                padding: "5px 14px",
                marginBottom: 24,
                fontSize: 12,
                color: "#D8B56E",
                fontWeight: 600,
              }}
            >
              With Vakyom ✦
            </div>
            {[
              {
                icon: "✅",
                title: "One-click document automation",
                desc: "Paperbook generated automatically in seconds, court-ready",
              },
              {
                icon: "✅",
                title: "Smart hearing alerts",
                desc: "eCourts sync sends automatic reminders 24h and 2h before court",
              },
              {
                icon: "✅",
                title: "Deep Legal OCR",
                desc: "AI reads regional language docs with 99%+ accuracy",
              },
              {
                icon: "✅",
                title: "Real-time client portal",
                desc: "Clients track their own case with live status updates",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{ display: "flex", gap: 12, marginBottom: 20 }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#D8B56E",
                      marginBottom: 3,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#8F9AB6", lineHeight: 1.5 }}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "📋",
    title: "One-Click Paperbook",
    desc: "Auto-compile all case documents",
    detail:
      "Generate complete paperbooks with one click. All case documents, filings, and evidence auto-organized into court-ready format. Supports custom templates for different court types across India.",
    demo: [
      "📁 Case: Sharma vs State",
      "  ├── FIR Copy.pdf ✓",
      "  ├── Bail Application.docx ✓",
      "  ├── Evidence Photos (12) ✓",
      "  └── Charge Sheet.pdf ✓",
      "→ Paperbook compiled in 2.3s",
    ],
  },
  {
    icon: "🔍",
    title: "Deep Legal OCR",
    desc: "Regional language document scanning",
    detail:
      "AI-powered OCR that reads Kannada, Hindi, Tamil, Telugu, Bengali documents with 99%+ accuracy. Converts scanned documents to editable, searchable text in seconds.",
    demo: [
      "Input: Scanned Kannada document",
      "Language: Kannada (auto-detected)",
      "Confidence: 99.2%",
      "Output: Editable text ready",
      "Legal terms highlighted: 14",
    ],
  },
  {
    icon: "✍️",
    title: "AI Legal Drafting",
    desc: "Generate notices, petitions, agreements",
    detail:
      "Input client details and let AI draft legally precise notices, petitions, and agreements in seconds. Supports all major document types with built-in legal compliance checks.",
    demo: [
      "Template: Legal Notice",
      "Client: Sharma, R.",
      "Claim: ₹2,50,000",
      "Court: Civil Court, Bangalore",
      "→ Draft generated in 4.1s",
    ],
  },
  {
    icon: "🌐",
    title: "Legal Translation",
    desc: "Translate across 12 Indian languages",
    detail:
      "Translate legal documents between English, Hindi, Kannada, Tamil, Telugu, Bengali and 6 more languages. Legally accurate translations that preserve technical terminology.",
    demo: [
      "Source: English",
      "Target: Kannada",
      "Document: Sale Deed",
      "Legal terms preserved: ✓",
      "Translation quality: High",
    ],
  },
  {
    icon: "🔔",
    title: "Smart Case Alerts",
    desc: "eCourts sync & hearing reminders",
    detail:
      "Automatic sync with the national eCourts portal. Receive alerts 24 hours and 2 hours before every hearing. Never miss a court date again.",
    demo: [
      "🔔 Tomorrow 10:30 AM",
      "   Sharma vs State — Room 3",
      "🔔 Next Week — Feb 19",
      "   Patel Property — Room 7",
      "Source: eCourts India",
    ],
  },
  {
    icon: "🔐",
    title: "Secure Workspace",
    desc: "End-to-end encrypted case files",
    detail:
      "Every file, message, and document is end-to-end encrypted using AES-256. Private lawyer-client ecosystem with zero third-party access or data sharing.",
    demo: [
      "Encryption: AES-256-GCM",
      "Key management: Client-side",
      "Third-party access: None",
      "Data residency: India",
      "Compliance: IT Act 2000",
    ],
  },
  {
    icon: "📊",
    title: "Client Tracking",
    desc: "Real-time case status portal",
    detail:
      "Clients get a dedicated portal to track case progress, view documents, receive hearing reminders, and communicate with their lawyer — without any technical knowledge.",
    demo: [
      "Client: Priya Sharma",
      "Case: Property Dispute",
      "Status: Hearing Scheduled",
      "Next date: Feb 12",
      "Last update: 2 hours ago",
    ],
  },
  {
    icon: "🤖",
    title: "AI Legal Assistant",
    desc: "Multilingual legal Q&A chatbot",
    detail:
      "Ask legal questions in Hindi, Kannada, Tamil or English. Get accurate, simplified legal guidance instantly, 24/7. Covers 12+ major legal topics relevant to Indian law.",
    demo: [
      "Q: Property dispute kya kare?",
      "Lang: Hindi (auto-detected)",
      "Topics matched: Land Dispute",
      "Response: ✓ Generated",
      "Disclaimer: ✓ Included",
    ],
  },
];

function FeaturesSection() {
  const [selectedFeature, setSelectedFeature] = useState<
    (typeof FEATURES)[0] | null
  >(null);

  return (
    <section
      id="features"
      style={{
        padding: "96px 24px",
        background: "linear-gradient(180deg, #060B1A 0%, #0B1430 100%)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="fade-section"
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700,
              color: "#EAF0FF",
              marginBottom: 12,
            }}
          >
            Everything Your Legal Practice Needs
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#8F9AB6",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            8 powerful tools — built specifically for India's legal system
          </p>
        </div>
        <div
          className="fade-section"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass-card"
              onClick={() => setSelectedFeature(f)}
              style={{
                borderRadius: 16,
                padding: "22px 20px",
                cursor: "pointer",
                transition:
                  "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-4px) scale(1.02)";
                el.style.borderColor = "rgba(216,181,110,0.3)";
                el.style.boxShadow =
                  "0 24px 64px rgba(0,0,0,0.5), 0 0 24px rgba(216,181,110,0.1)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "none";
                el.style.borderColor = "rgba(255,255,255,0.1)";
                el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.45)";
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: "rgba(216,181,110,0.12)",
                  border: "1px solid rgba(216,181,110,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 14,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#EAF0FF",
                  marginBottom: 6,
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: 12, color: "#8F9AB6", lineHeight: 1.5 }}>
                {f.desc}
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 12,
                  color: "#D8B56E",
                  fontWeight: 600,
                }}
              >
                Learn more →
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={!!selectedFeature}
        onOpenChange={() => setSelectedFeature(null)}
      >
        <DialogContent
          style={{
            background: "#0B1430",
            border: "1px solid rgba(216,181,110,0.25)",
            borderRadius: 20,
            padding: 32,
            maxWidth: 480,
          }}
        >
          {selectedFeature && (
            <>
              <DialogHeader>
                <DialogTitle
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#EAF0FF",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 28 }}>{selectedFeature.icon}</span>
                  {selectedFeature.title}
                </DialogTitle>
              </DialogHeader>
              <p
                style={{
                  fontSize: 14,
                  color: "#A9B4CF",
                  lineHeight: 1.7,
                  marginTop: 12,
                  marginBottom: 20,
                }}
              >
                {selectedFeature.detail}
              </p>
              <div
                style={{
                  background: "rgba(6,11,26,0.8)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "#A9B4CF",
                  marginBottom: 20,
                }}
              >
                {selectedFeature.demo.map((line, i) => (
                  <div key={i} style={{ marginBottom: 4 }}>
                    <span
                      style={{
                        color:
                          i === selectedFeature.demo.length - 1
                            ? "#D8B56E"
                            : "#A9B4CF",
                      }}
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href="#early-access"
                onClick={() => setSelectedFeature(null)}
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "linear-gradient(135deg, #D8B56E, #B99243)",
                  color: "#060B1A",
                  padding: "12px 24px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Get Early Access
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ─── Trust ────────────────────────────────────────────────────────────────────
function TrustSection() {
  return (
    <section id="trust" style={{ padding: "96px 24px", background: "#060B1A" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="fade-section"
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700,
              color: "#EAF0FF",
              marginBottom: 12,
            }}
          >
            Built on Trust. Designed for India.
          </h2>
        </div>
        <div
          className="fade-section"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              icon: "🏛️",
              title: "BCI Compliant",
              desc: "No lawyer marketplace. Fully compliant with Bar Council of India guidelines and professional conduct rules.",
            },
            {
              icon: "🔒",
              title: "End-to-End Encrypted",
              desc: "All data encrypted in transit and at rest using AES-256. Your clients' information is always secure.",
            },
            {
              icon: "🤝",
              title: "Private Ecosystem",
              desc: "Completely private workspace. No third-party access to sensitive case data. Zero data sharing.",
            },
            {
              icon: "🇮🇳",
              title: "Made for India",
              desc: "Designed around Indian courts, state-specific laws, eCourts integration, and 12 Indian languages.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="glass-card"
              style={{
                borderRadius: 18,
                padding: "28px 24px",
                transition: "box-shadow 0.3s, border-color 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.boxShadow =
                  "0 0 30px rgba(216,181,110,0.15), 0 20px 60px rgba(0,0,0,0.5)";
                el.style.borderColor = "rgba(216,181,110,0.3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.45)";
                el.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>{c.icon}</div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#EAF0FF",
                  marginBottom: 10,
                }}
              >
                {c.title}
              </div>
              <div style={{ fontSize: 13, color: "#8F9AB6", lineHeight: 1.6 }}>
                {c.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Workflow ─────────────────────────────────────────────────────────────────
function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimated(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { icon: "👤", label: "User", desc: "Submit query or upload document" },
    { icon: "🤖", label: "AI Processing", desc: "OCR, translation & analysis" },
    { icon: "⚖️", label: "Lawyer Review", desc: "Expert review in workspace" },
    {
      icon: "📁",
      label: "Case Management",
      desc: "Track, update, communicate",
    },
    { icon: "✅", label: "Resolution", desc: "Informed outcomes" },
  ];

  return (
    <section
      id="workflow"
      style={{
        padding: "96px 24px",
        background: "linear-gradient(180deg, #060B1A 0%, #0B1430 100%)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          className="fade-section"
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700,
              color: "#EAF0FF",
              marginBottom: 12,
            }}
          >
            How Vakyom Works
          </h2>
          <p style={{ fontSize: 16, color: "#8F9AB6" }}>
            From question to resolution — one seamless workflow
          </p>
        </div>
        <div
          ref={ref}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 0,
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.label}
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                minWidth: 120,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  flex: "0 0 auto",
                  padding: "0 8px",
                }}
              >
                <div
                  className={animated ? "active-ring" : ""}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "rgba(16,24,47,0.9)",
                    border: `2px solid ${animated ? "#D8B56E" : "rgba(255,255,255,0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    transition: "border-color 0.5s",
                    transitionDelay: `${i * 0.3}s`,
                    boxShadow: animated
                      ? "0 0 20px rgba(216,181,110,0.2)"
                      : "none",
                  }}
                >
                  {step.icon}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#EAF0FF",
                      marginBottom: 4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#8F9AB6",
                      maxWidth: 100,
                      textAlign: "center",
                      lineHeight: 1.4,
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: "rgba(255,255,255,0.1)",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: 56,
                    minWidth: 20,
                  }}
                >
                  {animated && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(90deg, #B99243, #E6CC8A)",
                        animation: `fillLine 0.8s ease forwards`,
                        animationDelay: `${i * 0.4}s`,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Investors ────────────────────────────────────────────────────────────────
function InvestorSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const targets = [60, 80, 35, 50000];
  const labels = ["%", "%", " Lakh+", " Cr"];
  const titles = [
    "Time Saved Per Case",
    "Document Automation",
    "Legal Cases/Year (India)",
    "Market Size (₹)",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          targets.forEach((target, i) => {
            let current = 0;
            const step = target / 60;
            const interval = setInterval(() => {
              current = Math.min(current + step, target);
              setCounts((prev) => {
                const next = [...prev];
                next[i] = Math.round(current);
                return next;
              });
              if (current >= target) clearInterval(interval);
            }, 33);
          });
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="investors"
      style={{
        padding: "96px 24px",
        background: "#060B1A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80%",
          height: "80%",
          background:
            "radial-gradient(ellipse, rgba(201,163,90,0.06) 0%, transparent 65%)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div
          className="fade-section"
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(216,181,110,0.1)",
              border: "1px solid rgba(216,181,110,0.3)",
              borderRadius: 999,
              padding: "5px 16px",
              marginBottom: 16,
              fontSize: 12,
              color: "#D8B56E",
              fontWeight: 600,
            }}
          >
            For Investors
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              background: "linear-gradient(135deg, #E6CC8A, #D8B56E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 12,
            }}
          >
            The Opportunity
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#8F9AB6",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            India's legal system is massive, underserved, and ready for
            transformation.
          </p>
        </div>
        <div
          ref={ref}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 56,
          }}
        >
          {counts.map((c, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                borderRadius: 18,
                padding: "28px 24px",
                textAlign: "center",
              }}
            >
              <div className="metric-number">
                {i === 3 ? `₹${c.toLocaleString()}` : c}
                {labels[i]}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#8F9AB6",
                  marginTop: 8,
                  lineHeight: 1.4,
                }}
              >
                {titles[i]}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#EAF0FF",
              marginBottom: 12,
            }}
          >
            "Built for scale. Designed for India's legal future."
          </p>
          <p
            style={{
              fontSize: 14,
              color: "#8F9AB6",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Vakyom addresses a ₹50,000 Cr+ market with a BCI-compliant SaaS
            model. No marketplace, no regulatory risk — pure legal intelligence
            infrastructure for advocates, firms, and citizens.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      style={{
        padding: "96px 24px",
        background: "linear-gradient(180deg, #060B1A 0%, #0B1430 100%)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          className="fade-section"
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700,
              color: "#EAF0FF",
              marginBottom: 12,
            }}
          >
            Trusted by Legal Professionals
          </h2>
        </div>
        <div
          className="fade-section"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              initials: "MJ",
              name: "Meera Joshi",
              role: "Advocate, Bangalore",
              quote:
                "Vakyom saved me 3+ hours daily. The OCR accuracy for Kannada documents is incredible. My entire workflow is transformed.",
            },
            {
              initials: "PS",
              name: "Priya Sharma",
              role: "Client, Mumbai",
              quote:
                "I finally understand what's happening in my own case. The case tracking portal is a game changer for clients like me.",
            },
            {
              initials: "RV",
              name: "Rohan Verma",
              role: "Law Student, Delhi",
              quote:
                "Legal knowledge is finally accessible. The AI assistant explains complex laws in simple language. Brilliant product.",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="glass-card"
              style={{ borderRadius: 18, padding: "28px 24px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #D8B56E, #B99243)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#060B1A",
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: "#EAF0FF" }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#8F9AB6" }}>{t.role}</div>
                </div>
              </div>
              <div style={{ color: "#D8B56E", marginBottom: 12, fontSize: 14 }}>
                ★★★★★
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#A9B4CF",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      style={{ padding: "96px 24px", background: "#060B1A" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          className="fade-section"
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700,
              color: "#EAF0FF",
              marginBottom: 12,
            }}
          >
            Simple, Transparent Pricing
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: 20,
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: yearly ? "#8F9AB6" : "#EAF0FF",
                fontWeight: 600,
              }}
            >
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 999,
                background: yearly ? "#D8B56E" : "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: yearly ? 26 : 3,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: yearly ? "#060B1A" : "#EAF0FF",
                  transition: "left 0.2s",
                }}
              />
            </button>
            <span
              style={{
                fontSize: 14,
                color: yearly ? "#EAF0FF" : "#8F9AB6",
                fontWeight: 600,
              }}
            >
              Yearly
            </span>
            {yearly && (
              <span
                style={{
                  background: "rgba(74,222,128,0.15)",
                  color: "#4ADE80",
                  padding: "3px 10px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                Save 20%
              </span>
            )}
          </div>
        </div>
        <div
          className="fade-section"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              name: "Free",
              tag: "For the public",
              price: "₹0",
              sub: "/month",
              features: [
                "AI legal queries (5/day)",
                "Multilingual support",
                "Legal guides & rights info",
                "Basic case information",
              ],
              cta: "Get Started Free",
              highlighted: false,
            },
            {
              name: "Pro Lawyer",
              tag: "For advocates",
              price: yearly ? "₹1,599" : "₹1,999",
              sub: "/month",
              features: [
                "Everything in Free",
                "Unlimited AI queries",
                "Deep Legal OCR",
                "AI drafting & notices",
                "Case workspace",
                "Client tracking portal",
                "Smart hearing alerts",
                "eCourts integration",
              ],
              cta: "Start Free Trial",
              highlighted: true,
            },
            {
              name: "Enterprise",
              tag: "For law firms",
              price: "Custom",
              sub: "",
              features: [
                "Everything in Pro",
                "Multi-user workspace",
                "Custom integrations",
                "Analytics dashboard",
                "Priority support",
                "Dedicated account manager",
              ],
              cta: "Contact Sales",
              highlighted: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlighted ? "glass-card gold-glow" : "glass-card"
              }
              style={{
                borderRadius: 20,
                padding: "32px 28px",
                position: "relative",
                border: plan.highlighted
                  ? "1px solid rgba(216,181,110,0.4)"
                  : undefined,
              }}
            >
              {plan.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #D8B56E, #B99243)",
                    color: "#060B1A",
                    padding: "4px 16px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  ⭐ RECOMMENDED
                </div>
              )}
              <div
                style={{
                  marginBottom: 8,
                  fontSize: 12,
                  color: "#8F9AB6",
                  fontWeight: 500,
                }}
              >
                {plan.tag}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#EAF0FF",
                  marginBottom: 4,
                }}
              >
                {plan.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: plan.highlighted ? "#D8B56E" : "#EAF0FF",
                  }}
                >
                  {plan.price}
                </span>
                <span style={{ fontSize: 13, color: "#8F9AB6" }}>
                  {plan.sub}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 28,
                }}
              >
                {plan.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: 13,
                      color: "#A9B4CF",
                    }}
                  >
                    <span style={{ color: "#D8B56E", flexShrink: 0 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <a
                href="#early-access"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: plan.highlighted
                    ? "linear-gradient(135deg, #D8B56E, #B99243)"
                    : "rgba(255,255,255,0.06)",
                  color: plan.highlighted ? "#060B1A" : "#EAF0FF",
                  padding: "12px 24px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  border: plan.highlighted
                    ? "none"
                    : "1px solid rgba(255,255,255,0.12)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.transform =
                    "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.transform =
                    "scale(1)")
                }
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Early Access ─────────────────────────────────────────────────────────────
function EarlyAccessSection() {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (actor) {
        await actor.addWaitlistEntry(name.trim(), email.trim(), phone.trim());
      }
      setSubmitted(true);
      toast.success("You're on the list! We'll be in touch soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="early-access"
      style={{
        padding: "96px 24px",
        background: "#060B1A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "90%",
          height: "90%",
          background:
            "radial-gradient(ellipse, rgba(201,163,90,0.08) 0%, transparent 60%)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(216,181,110,0.1)",
            border: "1px solid rgba(216,181,110,0.3)",
            borderRadius: 999,
            padding: "6px 18px",
            marginBottom: 20,
            fontSize: 13,
            color: "#D8B56E",
            fontWeight: 600,
          }}
        >
          🚀 Limited Early Access — Only 200 Spots
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            background: "linear-gradient(135deg, #E6CC8A, #D8B56E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          Join the Future of Legal Work
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "#A9B4CF",
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          Early users get{" "}
          <strong style={{ color: "#D8B56E" }}>lifetime Pro benefits</strong> at
          no extra cost. Be part of building India's first Legal Intelligence
          Workspace.
        </p>
        {submitted ? (
          <div
            className="glass-card"
            style={{
              borderRadius: 20,
              padding: 36,
              borderColor: "rgba(216,181,110,0.3)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#D8B56E",
                marginBottom: 8,
              }}
            >
              You're on the list!
            </div>
            <div style={{ fontSize: 14, color: "#8F9AB6", lineHeight: 1.6 }}>
              We'll reach out soon with your early access invite. Thank you for
              being part of Vakyom's journey.
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass-card"
            style={{
              borderRadius: 20,
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <Input
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#EAF0FF",
                height: 44,
                fontSize: 14,
              }}
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#EAF0FF",
                height: 44,
                fontSize: 14,
              }}
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#EAF0FF",
                height: 44,
                fontSize: 14,
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading
                  ? "rgba(216,181,110,0.4)"
                  : "linear-gradient(135deg, #D8B56E, #B99243)",
                color: "#060B1A",
                padding: "14px 24px",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 8px 24px rgba(216,181,110,0.3)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
              }}
            >
              {loading ? "Joining..." : "Join Early Access →"}
            </button>
            <p style={{ fontSize: 11, color: "#4A5568", textAlign: "center" }}>
              No spam. No payment required. Cancel anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      id="footer"
      style={{
        background: "#030611",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "56px 24px 32px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            marginBottom: 48,
          }}
          className="grid-cols-1 md:grid-cols-4"
        >
          <div>
            <VakyomLogo size={36} />
            <p
              style={{
                fontSize: 13,
                color: "#8F9AB6",
                lineHeight: 1.7,
                marginTop: 14,
                maxWidth: 260,
              }}
            >
              The Legal Intelligence Workspace — AI-powered tools for India's
              legal professionals.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {/* LinkedIn */}
              <a
                href="#"
                style={{ color: "#8F9AB6", transition: "color 0.2s" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#D8B56E")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#8F9AB6")
                }
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* Twitter */}
              <a
                href="#"
                style={{ color: "#8F9AB6", transition: "color 0.2s" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#D8B56E")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#8F9AB6")
                }
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                style={{ color: "#8F9AB6", transition: "color 0.2s" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#D8B56E")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#8F9AB6")
                }
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
          {[
            {
              title: "Product",
              links: ["Features", "Walkthrough", "Pricing", "Early Access"],
            },
            {
              title: "Company",
              links: [
                "About Vakyom",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
              ],
            },
            { title: "Contact", links: [] },
          ].map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#EAF0FF",
                  marginBottom: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {col.title}
              </div>
              {col.title === "Contact" ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <a
                    href="https://wa.me/918152889991"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 13,
                      color: "#8F9AB6",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ color: "#25D366" }}>●</span> Chat on WhatsApp
                  </a>
                  <a
                    href="mailto:contact@vakyom.in"
                    style={{
                      fontSize: 13,
                      color: "#8F9AB6",
                      textDecoration: "none",
                    }}
                  >
                    contact@vakyom.in
                  </a>
                </div>
              ) : (
                col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    style={{
                      display: "block",
                      fontSize: 13,
                      color: "#8F9AB6",
                      textDecoration: "none",
                      marginBottom: 10,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "#D8B56E")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "#8F9AB6")
                    }
                  >
                    {l}
                  </a>
                ))
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12, color: "#4A5568" }}>
            © 2025 Vakyom. Built for India's legal future. By Tarun Kumar.
          </span>
          <span style={{ fontSize: 12, color: "#4A5568" }}>
            The Legal Intelligence Workspace
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/918152889991"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#25D366",
        boxShadow: "0 4px 20px rgba(37,211,102,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 6px 28px rgba(37,211,102,0.7)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 4px 20px rgba(37,211,102,0.5)";
      }}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.504L4 29l7.697-1.808A11.95 11.95 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3z"
          fill="white"
        />
        <path
          d="M21.898 19.07c-.301-.15-1.776-.876-2.052-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.301-.15-1.27-.468-2.42-1.492-.894-.797-1.497-1.782-1.672-2.082-.175-.3-.018-.462.132-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.626-.925-2.226-.243-.585-.49-.506-.675-.515l-.575-.01c-.2 0-.525.075-.8.375s-1.05 1.026-1.05 2.501c0 1.476 1.075 2.902 1.225 3.102.15.2 2.115 3.226 5.124 4.524.716.309 1.274.494 1.709.633.718.228 1.372.196 1.888.119.576-.086 1.776-.727 2.027-1.427.25-.7.25-1.3.175-1.426-.075-.125-.275-.2-.575-.35z"
          fill="#25D366"
        />
      </svg>
    </a>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function AppContent() {
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    const timer = setTimeout(() => {
      document
        .querySelectorAll(".fade-section, .fade-left, .fade-right")
        .forEach((el) => observer.observe(el));
    }, 100);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        className="cursor-glow"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      <Nav />
      <main
        style={{
          background:
            "linear-gradient(135deg, #060B1A 0%, #070D1F 60%, #030611 100%)",
        }}
      >
        <HeroSection />
        <WalkthroughSection />
        <ProblemSolutionSection />
        <FeaturesSection />
        <TrustSection />
        <WorkflowSection />
        <InvestorSection />
        <TestimonialsSection />
        <PricingSection />
        <EarlyAccessSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
