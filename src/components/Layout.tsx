
import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";
import { useOnboarding } from "@/hooks/useOnboarding";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import { useBannerName } from "@/hooks/useBannerName";
import BannerNameModal from "./onboarding/BannerNameModal";
import { ForgedWeekCelebration } from "./forge/ForgedWeekCelebration";
import { useForgedWeekCelebration } from "@/hooks/useForgedWeekCelebration";
import { ForgedWeekProvider } from "@/contexts/ForgedWeekContext";
import { ActiveWorkoutProvider } from "@/contexts/ActiveWorkoutContext";
import { PersistentWorkoutBar } from "./PersistentWorkoutBar";
import { ImageIcon } from "./ImageIcon";
import { NotificationSettings } from "./NotificationSettings";

const Layout = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { hasCompletedOnboarding, completeOnboarding } = useOnboarding();
  const { showCelebration, newlyForgedWeek, closeCelebration } = useForgedWeekCelebration();
  const { showBannerNameModal, completeBannerNameSetup } = useBannerName();
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/auth', { replace: true });
    }
  }, [session, navigate]);

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
    return null; // or a loading spinner while redirecting
  }

  // Show onboarding if not completed
  if (hasCompletedOnboarding === false) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  // Show loading while checking onboarding status
  if (hasCompletedOnboarding === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ActiveWorkoutProvider>
      <ForgedWeekProvider>
        <div className="flex flex-col h-full max-w-md mx-auto bg-background">
        <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ImageIcon src="/lovable-uploads/024aba45-7ed8-4f1a-ab9b-d8bfccf26ea5.png" alt="Ragnarok Fit Logo" className="h-12 w-12 text-primary" />
                <h1 className="font-bold text-lg tracking-tight">Ragnarok Fit</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setShowNotificationSettings(true)} aria-label="Notifications">
                  <ImageIcon src="/lovable-uploads/ab4c655d-5026-4d78-a7c3-f58ea6593cbc.png" alt="Notifications" className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
          </div>
        </header>
        <main className="flex-grow p-4 overflow-y-auto">
          <Outlet />
        </main>
        <PersistentWorkoutBar />
        <BottomNav />
        
        {/* Forged Week Celebration */}
        <ForgedWeekCelebration 
          isOpen={showCelebration}
          onClose={closeCelebration}
          weekNumber={newlyForgedWeek}
        />
        
        {/* Notification Settings */}
        <NotificationSettings
          isOpen={showNotificationSettings}
          onClose={() => setShowNotificationSettings(false)}
        />
        
        {/* Banner Name Modal */}
        <BannerNameModal
          open={showBannerNameModal}
          onComplete={completeBannerNameSetup}
        />
        </div>
      </ForgedWeekProvider>
    </ActiveWorkoutProvider>
  );
};

export default Layout;
