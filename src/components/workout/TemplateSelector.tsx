import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import { TemplateForm } from "@/components/workout/TemplateForm";
import { TemplateList } from "@/components/workout/TemplateList";
import type { WorkoutTemplate } from "@/types";

interface TemplateSelectorProps {
  onStartWorkout: (template: WorkoutTemplate) => void;
}

export const TemplateSelector = ({ onStartWorkout }: TemplateSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: templates, isLoading: isLoadingTemplates } = useWorkoutTemplates();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Choose from your saved workout templates</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Template
            </Button>
          </DialogTrigger>
          <TemplateForm open={open} onOpenChange={setOpen} />
        </Dialog>
      </div>

      <TemplateList 
        templates={templates}
        isLoading={isLoadingTemplates}
        onStartWorkout={onStartWorkout}
      />
    </div>
  );
};
