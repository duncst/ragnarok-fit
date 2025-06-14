
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkoutTemplate } from "@/types";
import { useNavigate } from "react-router-dom";
import { NewTemplateDialog } from "@/components/workout-templates/NewTemplateDialog";
import { TemplateList } from "@/components/workout-templates/TemplateList";

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
        <NewTemplateDialog onTemplateCreated={handleTemplateCreated} />
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
