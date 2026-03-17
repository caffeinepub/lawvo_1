import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useState } from "react";
import type { Language } from "./backend.d";
import { useActor } from "./hooks/useActor";
import { LanguageProvider, useTranslation } from "./i18n/useTranslation";
import { About } from "./screens/About";
import { Dashboard, type DashboardScreen } from "./screens/Dashboard";
import { DocumentScanner } from "./screens/DocumentScanner";
import { LanguageSelect } from "./screens/LanguageSelect";
import { LawyerMarketplace } from "./screens/LawyerMarketplace";
import { LegalGuidance } from "./screens/LegalGuidance";
import { MyCases } from "./screens/MyCases";
import { VoiceAssistant } from "./screens/VoiceAssistant";
import { Welcome } from "./screens/Welcome";

type Screen = "welcome" | "language" | "dashboard" | DashboardScreen;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AppContent() {
  const [screen, setScreen] = useState<Screen>("welcome");
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
  };

  return (
    <>
      {screen === "welcome" && (
        <Welcome onGetStarted={() => setScreen("language")} />
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
