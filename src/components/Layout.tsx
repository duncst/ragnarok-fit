
import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import { Barbell, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

const Layout = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-background">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Barbell className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg tracking-tight">Hybrid Trainer</h1>
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
