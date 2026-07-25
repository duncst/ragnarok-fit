import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DeleteConfirmationDialog from "@/components/history/DeleteConfirmationDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useTemplateOperations } from "@/hooks/useTemplateOperations";
import type { WorkoutTemplate } from "@/types";

interface TemplateListProps {
  templates?: WorkoutTemplate[];
  isLoading: boolean;
  onStartWorkout: (template: WorkoutTemplate) => void;
  showPublicToggle?: boolean;
}

export const TemplateList = ({ templates, isLoading, onStartWorkout, showPublicToggle = false }: TemplateListProps) => {
  const { user } = useAuth();
  const { updateTemplateMutation, deleteTemplateMutation } = useTemplateOperations();

  const handleTogglePublic = (template: WorkoutTemplate) => {
    updateTemplateMutation.mutate({ id: template.id, is_public: !template.is_public });
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplateMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">
        You don't have any workout templates yet. Create one to get started!
      </p>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {templates.map((template) => (
        <AccordionItem value={template.id} key={template.id} className="border-0">
          <Card>
            <AccordionTrigger className="p-4 hover:no-underline w-full rounded-t-lg data-[state=open]:rounded-b-none [&[data-state=closed]]:rounded-b-lg">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-lg font-semibold text-left">{template.name}</p>
                  {template.user_id !== user?.id && (
                    <p className="text-xs text-muted-foreground text-left">Shared template</p>
                  )}
                </div>
                <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={() => onStartWorkout(template)} aria-label={`Start ${template.name} workout`}>
                    <Play className="h-5 w-5 text-primary" />
                  </Button>
                  {template.user_id === user?.id && (
                    <DeleteConfirmationDialog
                      onConfirm={() => handleDeleteTemplate(template.id)}
                      isLoading={deleteTemplateMutation.isPending && deleteTemplateMutation.variables === template.id}
                    />
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  {template.exercises.map((ex) => (
                    <li key={ex.name} className="flex justify-between">
                      <span>{ex.name}</span>
                      <span className="text-muted-foreground">
                        {ex.sets} sets{ex.suggestedReps ? ` × ${ex.suggestedReps} reps` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
                {showPublicToggle && template.user_id === user?.id && (
                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Switch
                      id={`is-public-${template.id}`}
                      checked={template.is_public}
                      onCheckedChange={() => handleTogglePublic(template)}
                      disabled={updateTemplateMutation.isPending}
                    />
                    <Label htmlFor={`is-public-${template.id}`} className="text-sm">
                      Public template
                    </Label>
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      ))}
    </Accordion>
  );
};