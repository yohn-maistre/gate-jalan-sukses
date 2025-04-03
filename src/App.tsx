
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { RoadmapProvider } from "./contexts/RoadmapContext";
import { ModelConfigProvider } from "./contexts/ModelConfigContext";

// Pages
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import RoadmapReview from "./pages/RoadmapReview";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate loading state
    setTimeout(() => {
      setIsInitialized(true);
    }, 1000);
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-jalan-background">
        <h1 className="text-4xl font-bold text-jalan-text animate-pulse-subtle">JALAN SUKSES</h1>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ModelConfigProvider>
        <AuthProvider>
          <RoadmapProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/roadmap-review" element={<RoadmapReview />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </RoadmapProvider>
        </AuthProvider>
      </ModelConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
