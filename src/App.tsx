
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InputSanitizer } from "@/components/security/InputSanitizer";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RunPage from "./pages/RunPage";
import RitualWorkoutPage from "./pages/RitualWorkoutPage";
import NewWorkoutPage from "./pages/NewWorkoutPage";
import CapabilityPathsPage from "./pages/CapabilityPathsPage";
import ExercisesPage from "./pages/ExercisesPage";

import OneRepMaxCalculatorPage from "./pages/OneRepMaxCalculatorPage";
import ForgePage from "./pages/ForgePage";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import BlogPage from "./pages/BlogPage";
import WorkoutHistoryPage from "./pages/WorkoutHistoryPage";
import { AuthProvider } from "./contexts/AuthContext";
import LogBodyMetricsPage from "./pages/LogBodyMetricsPage";
import EnduranceTrialsPage from "./pages/EnduranceTrialsPage";
import EnduranceSessionPage from "./pages/EnduranceSessionPage";
import ClanPage from "./pages/ClanPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <InputSanitizer>
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route element={<Layout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/exercises" element={<ExercisesPage />} />
                <Route path="/forge" element={<ForgePage />} />
                <Route path="/capability-paths" element={<CapabilityPathsPage />} />
                <Route path="/history" element={<WorkoutHistoryPage />} />
                <Route path="/run" element={<RunPage />} />
                
                <Route path="/workout/new" element={<NewWorkoutPage />} />
                <Route path="/ritual/:templateId/workout" element={<RitualWorkoutPage />} />
                <Route path="/1rm-calculator" element={<OneRepMaxCalculatorPage />} />
                <Route path="/log-body-metrics" element={<LogBodyMetricsPage />} />
                <Route path="/clan" element={<ClanPage />} />
                <Route path="/endure/trials" element={<EnduranceTrialsPage />} />
                <Route path="/endure/session" element={<EnduranceSessionPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </InputSanitizer>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
