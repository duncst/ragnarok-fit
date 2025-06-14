
import { Library, History, ClipboardList } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ImageIcon } from "./ImageIcon";

const HomeIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/1162d462-bd6b-4a8e-9f3f-4c0f1ebce4b3.png" alt="Home icon" className={className} />
);

const RunningIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/ce6da73b-d67b-4c6a-9101-65cfa425f67a.png" alt="Running icon" className={className} />
);

const navItems = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/exercises", icon: Library, label: "Exercises" },
  { to: "/templates", icon: ClipboardList, label: "Templates" },
  { to: "/history", icon: History, label: "History" },
  { to: "/run", icon: RunningIcon, label: "Running" },
];

const BottomNav = () => {
  return (
    <nav className="sticky bottom-0 w-full bg-card border-t border-border">
      <div className="flex justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full text-muted-foreground transition-colors",
                isActive ? "text-primary" : "hover:text-foreground"
              )
            }
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
