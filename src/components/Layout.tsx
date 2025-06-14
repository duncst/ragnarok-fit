
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import { Dumbbell } from "lucide-react";

const Layout = () => {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-background">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg tracking-tight">Hybrid Trainer</h1>
            </div>
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
