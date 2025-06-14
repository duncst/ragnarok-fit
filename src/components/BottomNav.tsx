
import { Home, Library, Footprints } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/exercises", icon: Library, label: "Exercises" },
  { to: "/run", icon: Footprints, label: "Running" },
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
