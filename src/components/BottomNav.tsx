
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ImageIcon } from "./ImageIcon";
import { Anvil, Target, Users } from "lucide-react";

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

const PathsIcon = ({ className }: { className?: string }) => (
    <ImageIcon src="/lovable-uploads/ba349eee-18d7-4d58-8a2b-dee8c1703e5f.png" alt="Paths icon" className={className} />
);

const navItems = [
  { to: "/home", icon: HomeIcon, label: "Home" },
  { to: "/workout/new", icon: StartWorkoutIcon, label: "Workout" },
  { to: "/forge", icon: Anvil, label: "Forge" },
  { to: "/capability-paths", icon: PathsIcon, label: "Paths" },
  { to: "/clan", icon: Users, label: "Clan" },
];

const BottomNav = () => {
  return (
    <nav className="sticky bottom-0 w-full bg-card border-t border-border">
      <div className="flex justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/home'}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full text-muted-foreground transition-colors text-center",
                isActive ? "text-primary" : "hover:text-foreground"
              )
            }
          >
            <item.icon className={cn("mb-1", item.label === 'Paths' ? 'h-10 w-10 mt-1' : ['Running', 'Home', 'Workout'].includes(item.label) ? 'h-8 w-8' : 'h-7 w-7')} />
            <span className="text-xs font-medium leading-tight">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
