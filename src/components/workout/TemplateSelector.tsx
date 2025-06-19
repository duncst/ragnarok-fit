import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { exercises as allExercises } from "@/data/exercises";
import type { TemplateExercise, WorkoutTemplate } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteConfirmationDialog from "@/components/history/DeleteConfirmationDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X, ArrowUp, ArrowDown } from "lucide-react";

interface TemplateSelectorProps {
  onStartWorkout: (template: WorkoutTemplate) => void;
}

export const TemplateSelector = ({ onStartWorkout }: TemplateSelectorProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const { toast } = useToast();
  const [selectedExercises, setSelectedExercises] = useState<TemplateExercise[]>([]);
  const [isExercisePickerOpen, setExercisePickerOpen] = useState(false);
  const [pickerSelectedExercises, setPickerSelectedExercises] = useState<Set<string>>(new Set());
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const { data: templates, isLoading: isLoadingTemplates } = useQuery<WorkoutTemplate[]>({
    queryKey: ['workout-templates', user?.id],
    queryFn: async () => {
      const { data: templatesData, error: templatesError } = await supabase
        .from('workout_templates')
        .select('*, workout_template_exercises(*)')
        .order('created_at', { ascending: false })
        .order('order', { foreignTable: 'workout_template_exercises', ascending: true });

      if (templatesError) throw templatesError;

      const populatedTemplates: WorkoutTemplate[] = templatesData.map(template => {
        const exercises: TemplateExercise[] = template.workout_template_exercises
          .map((ex: any) => {
            const exerciseDef = allExercises.find(e => e.name === ex.exercise_name);
            if (!exerciseDef) return null;
            return { ...exerciseDef, sets: ex.sets };
          })
          .filter((ex): ex is TemplateExercise => ex !== null);

        return {
          id: template.id,
          name: template.name,
          is_public: template.is_public,
          user_id: template.user_id,
          created_at: template.created_at,
          exercises: exercises,
        };
      });
      return populatedTemplates;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!open) {
      setTemplateName("");
      setSelectedExercises([]);
      setIsPublic(false);
    }
  }, [open]);

  useEffect(() => {
    if (isExercisePickerOpen) {
      setPickerSelectedExercises(new Set(selectedExercises.map(e => e.name)));
      setExerciseSearchTerm("");
    }
  }, [isExercisePickerOpen, selectedExercises]);
  
  const createTemplateMutation = useMutation({
    mutationFn: async ({ name, exercises, isPublic: is_public }: { name: string, exercises: TemplateExercise[], isPublic: boolean }) => {
      const { data: templateData, error: templateError } = await supabase
        .from('workout_templates')
        .insert({ name, is_public })
        .select()
        .single();
      if (templateError) throw templateError;

      const exercisesToInsert = exercises.map((ex, index) => ({
        workout_template_id: templateData.id,
        exercise_name: ex.name,
        sets: ex.sets,
        order: index,
      }));
      const { error: exercisesError } = await supabase
        .from('workout_template_exercises')
        .insert(exercisesToInsert);
      if (exercisesError) {
        await supabase.from('workout_templates').delete().eq('id', templateData.id);
        throw exercisesError;
      }
      return templateData;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Template created." });
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error creating template", description: error.message, variant: "destructive" });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workout_templates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Template deleted." });
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting template", description: error.message, variant: "destructive" });
    }
  });

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Error",
        description: "Template name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    if (selectedExercises.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one exercise.",
        variant: "destructive",
      });
      return;
    }
    createTemplateMutation.mutate({ name: templateName, exercises: selectedExercises, isPublic });
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplateMutation.mutate(id);
  };

  const filteredPickerExercises = allExercises.filter(ex => 
    ex.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
  );

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Workout Template</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. Push Day"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
                <Label htmlFor="is-public">Make this template public</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" onClick={handleCreateTemplate} disabled={createTemplateMutation.isPending}>
                {createTemplateMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoadingTemplates ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates && templates.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {templates.map((template) => (
            <AccordionItem value={template.id} key={template.id} className="border-0">
              <Card>
                <AccordionTrigger className="p-4 hover:no-underline w-full rounded-t-lg data-[state=open]:rounded-b-none [&[data-state=closed]]:rounded-b-lg">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <p className="text-lg font-semibold text-left">{template.name}</p>
                      {template.user_id !== user?.id && <p className="text-xs text-muted-foreground text-left">Shared template</p>}
                    </div>
                    <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => onStartWorkout(template)}>
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
                    <ul className="space-y-2 text-sm">
                      {template.exercises.map((ex) => (
                        <li key={ex.name} className="flex justify-between">
                          <span>{ex.name}</span>
                          <span className="text-muted-foreground">
                            {ex.sets} sets{ex.suggestedReps ? ` × ${ex.suggestedReps} reps` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          You don't have any workout templates yet. Create one to get started!
        </p>
      )}
    </div>
  );
};
