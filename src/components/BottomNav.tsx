
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ImageIcon } from "./ImageIcon";
import { Anvil } from "lucide-react";

const HomeIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/5415ad51-d2ec-4830-ae93-73416fc1e5ee.png" alt="Home icon" className={className} />
);

const RunningIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/ce6da73b-d67b-4c6a-9101-65cfa425f67a.png" alt="Running icon" className={className} />
);

const StartWorkoutIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/59098dd1-6550-4f60-bc29-d0c1165a7d3c.png" alt="Exercise icon" className={className} />
);

const ExerciseIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/1283fc3a-3186-4200-86ce-e6e99c46f46d.png" alt="Start Workout icon" className={className} />
);

const navItems = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/workout/new", icon: StartWorkoutIcon, label: "Start Workout" },
  { to: "/forge", icon: Anvil, label: "Forge" },
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
            <item.icon className={cn("mb-1", item.label === 'Running' ? 'h-8 w-8' : 'h-7 w-7')} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
