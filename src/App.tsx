
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import WorkoutsPage from "./pages/WorkoutsPage";
import RunPage from "./pages/RunPage";
import NewWorkoutPage from "./pages/NewWorkoutPage";
import ExercisesPage from "./pages/ExercisesPage";
import LogRunPage from "./pages/LogRunPage";
import AnalyticsPage from "./pages/AnalyticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<WorkoutsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/run" element={<RunPage />} />
            <Route path="/log-run" element={<LogRunPage />} />
            <Route path="/workout/new" element={<NewWorkoutPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
