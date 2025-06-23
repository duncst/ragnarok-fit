
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RunPage from "./pages/RunPage";
import NewWorkoutPage from "./pages/NewWorkoutPage";
import ExercisesPage from "./pages/ExercisesPage";
import LogRunPage from "./pages/LogRunPage";
import OneRepMaxCalculatorPage from "./pages/OneRepMaxCalculatorPage";
import ForgePage from "./pages/ForgePage";
import LandingPage from "./pages/LandingPage";
import { AuthProvider } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import LogBodyMetricsPage from "./pages/LogBodyMetricsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/forge" element={<ForgePage />} />
              <Route path="/run" element={<RunPage />} />
              <Route path="/log-run" element={<LogRunPage />} />
              <Route path="/workout/new" element={<NewWorkoutPage />} />
              <Route path="/1rm-calculator" element={<OneRepMaxCalculatorPage />} />
              <Route path="/log-body-metrics" element={<LogBodyMetricsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
