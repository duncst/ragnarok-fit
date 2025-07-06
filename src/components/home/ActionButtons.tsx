
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageIcon } from "@/components/ImageIcon";

export const ActionButtons = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button asChild variant="secondary">
        <Link to="/run">
          <ImageIcon src="/lovable-uploads/ce6da73b-d67b-4c6a-9101-65cfa425f67a.png" alt="Running icon" className="mr-2 h-7 w-7" /> Record Run
        </Link>
      </Button>
      <Button asChild>
        <Link to="/workout/new">
          <Plus className="mr-2 h-6 w-6" /> Start Workout
        </Link>
      </Button>
    </div>
  );
};
