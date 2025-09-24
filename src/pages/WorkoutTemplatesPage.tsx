import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import { TemplateForm } from "@/components/workout/TemplateForm";
import { TemplateList } from "@/components/workout/TemplateList";
import { ValhallaSection } from "@/components/workout/ValhallaSection";
import type { WorkoutTemplate } from "@/types";

const WorkoutTemplatesPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data: templates, isLoading: isLoadingTemplates } = useWorkoutTemplates();

  const handleStartWorkout = (template: WorkoutTemplate) => {
    navigate("/workout/new", { state: { template } });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Workout Templates</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Template
              </Button>
            </DialogTrigger>
            <TemplateForm open={open} onOpenChange={setOpen} />
          </Dialog>
        </div>
        
        <ValhallaSection />
        
        <Card>
          <CardHeader>
            <CardTitle>My Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateList 
              templates={templates}
              isLoading={isLoadingTemplates}
              onStartWorkout={handleStartWorkout}
              showPublicToggle={true}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default WorkoutTemplatesPage;
