
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkoutTemplate } from "@/types";
import { useNavigate } from "react-router-dom";
import { NewTemplateDialog } from "@/components/workout-templates/NewTemplateDialog";
import { TemplateList } from "@/components/workout-templates/TemplateList";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const WorkoutTemplatesPage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  const handleStartWorkout = (template: WorkoutTemplate) => {
    navigate("/workout/new", { state: { template } });
  };

  const handleTemplateCreated = (newTemplate: WorkoutTemplate) => {
    setTemplates((prev) => [...prev, newTemplate]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workout Templates</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/workout/new')}>
            <Zap className="mr-2 h-4 w-4" /> Start Workout
          </Button>
          <NewTemplateDialog onTemplateCreated={handleTemplateCreated} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateList templates={templates} onStartWorkout={handleStartWorkout} />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutTemplatesPage;
