
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import type { WorkoutTemplate } from "@/types";

interface TemplateListProps {
  templates: WorkoutTemplate[];
  onStartWorkout: (template: WorkoutTemplate) => void;
}

export const TemplateList = ({ templates, onStartWorkout }: TemplateListProps) => {
  if (templates.length === 0) {
    return (
      <p className="text-muted-foreground">
        You don't have any workout templates yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => onStartWorkout(template)}>
              <Zap className="h-5 w-5 text-primary" />
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {template.exercises.map((ex) => (
                <li key={ex.name} className="flex justify-between">
                  <span>{ex.name}</span>
                  <span className="text-muted-foreground">{ex.sets} sets</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
