
import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import { Mountain, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";
import { useOnboarding } from "@/hooks/useOnboarding";
import NewOnboardingFlow from "./onboarding/NewOnboardingFlow";

const Layout = () => {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const { hasCompletedOnboarding, completeOnboarding } = useOnboarding();

  useEffect(() => {
    console.log('Layout mounted with session:', !!session, 'user:', !!user);
    
    if (!session) {
      console.log('No session, redirecting to /auth');
      navigate('/auth', { replace: true });
    }
  }, [session, navigate]);

  useEffect(() => {
    console.log('Onboarding status changed:', hasCompletedOnboarding);
  }, [hasCompletedOnboarding]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      sonnerToast.error("Logout failed", { description: error.message });
    } else {
      sonnerToast.success("Logged out successfully");
      navigate('/auth');
    }
  };

  if (!session) {
    console.log('No session, returning null');
    return null; // or a loading spinner while redirecting
  }

  // Show onboarding if not completed (hasCompletedOnboarding === false)
  if (hasCompletedOnboarding === false) {
    console.log('Showing onboarding flow');
    return <NewOnboardingFlow onComplete={completeOnboarding} />;
  }

  // Show loading while checking onboarding status
  if (hasCompletedOnboarding === null) {
    console.log('Loading onboarding status');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log('Showing main app layout');

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-background">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Mountain className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg tracking-tight">Ragnarok Fit</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
              <LogOut className="h-5 w-5" />
            </Button>
        </div>
      </header>
      <main className="flex-grow p-4 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
