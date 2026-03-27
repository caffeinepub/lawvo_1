import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Language } from "./backend.d";
import { WelcomeSplash } from "./components/WelcomeSplash";
import { useActor } from "./hooks/useActor";
import { LanguageProvider, useTranslation } from "./i18n/useTranslation";
import { About } from "./screens/About";
import { AdminScreen } from "./screens/AdminScreen";
import { Dashboard, type DashboardScreen } from "./screens/Dashboard";
import { DocumentScanner } from "./screens/DocumentScanner";
import { LanguageSelect } from "./screens/LanguageSelect";
import { LawyerDashboardScreen } from "./screens/LawyerDashboardScreen";
import { LawyerLoginScreen } from "./screens/LawyerLoginScreen";
import { LawyerMarketplace } from "./screens/LawyerMarketplace";
import { LegalGuidance } from "./screens/LegalGuidance";
import { LoginScreen } from "./screens/LoginScreen";
import { MyCases } from "./screens/MyCases";
import { VoiceAssistant } from "./screens/VoiceAssistant";
import { Welcome } from "./screens/Welcome";

type Screen =
  | "welcome"
  | "login"
  | "language"
  | "dashboard"
  | "lawyer-login"
  | "lawyer-dashboard"
  | "admin"
  | DashboardScreen;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

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
      <span className="sr-only">Chat on WhatsApp</span>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
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

function AppContent() {
  const [screen, setScreen] = useState<Screen>(() => {
    const role = localStorage.getItem("vakyom_role");
    const userName = localStorage.getItem("vakyom_user_name");
    const lawyerName = localStorage.getItem("vakyom_lawyer_name");
    if (role === "lawyer" && lawyerName) return "lawyer-dashboard";
    if (userName) return "language";
    return "welcome";
  });
  const [showSplash, setShowSplash] = useState(false);
  const { setLanguage } = useTranslation();
  const { actor } = useActor();

  useEffect(() => {
    if (actor) {
      actor.initialize().catch(console.error);
    }
  }, [actor]);

  const goToDashboard = () => setScreen("dashboard");

  const handleLanguageContinue = (lang: Language) => {
    setLanguage(lang);
    setScreen("dashboard");
    setShowSplash(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("vakyom_user_name");
    localStorage.removeItem("vakyom_lawyer_name");
    localStorage.removeItem("vakyom_role");
    setScreen("login");
  };

  return (
    <>
      {screen === "welcome" && (
        <Welcome onGetStarted={() => setScreen("login")} />
      )}

      {screen === "login" && (
        <LoginScreen
          onSuccess={() => setScreen("language")}
          onLawyerLogin={() => setScreen("lawyer-login")}
          onAdminLogin={() => setScreen("admin")}
        />
      )}

      {screen === "language" && (
        <LanguageSelect onContinue={handleLanguageContinue} />
      )}

      {screen === "dashboard" && (
        <Dashboard onNavigate={(s: DashboardScreen) => setScreen(s)} />
      )}

      {screen === "voice" && <VoiceAssistant onBack={goToDashboard} />}
      {screen === "document" && <DocumentScanner onBack={goToDashboard} />}
      {screen === "guidance" && (
        <LegalGuidance
          onBack={goToDashboard}
          onConnectLawyer={() => setScreen("lawyers")}
        />
      )}
      {screen === "lawyers" && <LawyerMarketplace onBack={goToDashboard} />}
      {screen === "cases" && <MyCases onBack={goToDashboard} />}
      {screen === "about" && <About onBack={goToDashboard} />}

      {screen === "lawyer-login" && (
        <LawyerLoginScreen
          onSuccess={() => setScreen("lawyer-dashboard")}
          onBack={() => setScreen("login")}
        />
      )}

      {screen === "lawyer-dashboard" && (
        <LawyerDashboardScreen onLogout={handleLogout} />
      )}

      {screen === "admin" && <AdminScreen onLogout={handleLogout} />}

      {showSplash && <WelcomeSplash onDismiss={() => setShowSplash(false)} />}
      <WhatsAppButton />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
