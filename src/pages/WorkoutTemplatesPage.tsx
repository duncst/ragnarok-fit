import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowUp, ArrowDown, Play } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteConfirmationDialog from "@/components/history/DeleteConfirmationDialog";

const WorkoutTemplatesPage = () => {
  const navigate = useNavigate();
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
        await supabase.from('workout_templates').delete().eq('id', templateData.id); // Rollback
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

  const handleRemoveExercise = (exerciseName: string) => {
    setSelectedExercises(prev => prev.filter(ex => ex.name !== exerciseName));
  };
  
  const handleAddSelectedExercises = () => {
    const newSelectedExercises = allExercises
      .filter((ex) => pickerSelectedExercises.has(ex.name))
      .map((ex) => {
        const existingExercise = selectedExercises.find(
          (selectedEx) => selectedEx.name === ex.name
        );
        return existingExercise || { ...ex, sets: 3 };
      });
    
    // This logic ensures that unselected exercises are removed, and the order is preserved for existing ones.
    const finalExercises = newSelectedExercises.filter(ex => pickerSelectedExercises.has(ex.name));
    setSelectedExercises(finalExercises);
    setExercisePickerOpen(false);
  };

  const handleSetsChange = (exerciseName: string, sets: number) => {
    setSelectedExercises(currentExercises =>
      currentExercises.map(ex =>
        ex.name === exerciseName ? { ...ex, sets: isNaN(sets) || sets < 1 ? 1 : sets } : ex
      )
    );
  };

  const handleMoveExercise = (index: number, direction: 1 | -1) => {
    setSelectedExercises(prev => {
      const newExercises = [...prev];
      const newIndex = index + direction;

      if (newIndex < 0 || newIndex >= newExercises.length) {
        return prev;
      }

      const [item] = newExercises.splice(index, 1);
      newExercises.splice(newIndex, 0, item);
      return newExercises;
    });
  };

  const handleStartWorkout = (template: WorkoutTemplate) => {
    navigate("/workout/new", { state: { template } });
  };

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, is_public }: { id: string, is_public: boolean }) => {
      const { error } = await supabase.from('workout_templates').update({ is_public }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast({ title: "Success", description: `Template is now ${variables.is_public ? 'public' : 'private'}.` });
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
    },
    onError: (error: any) => {
      toast({ title: "Error updating template", description: error.message, variant: "destructive" });
    }
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

  const handleTogglePublic = (template: WorkoutTemplate) => {
    updateTemplateMutation.mutate({ id: template.id, is_public: !template.is_public });
  };

  const handleDeleteTemplate = (id: string) => {
    // In a real app, you might want a confirmation dialog here.
    deleteTemplateMutation.mutate(id);
  };

  const filteredPickerExercises = allExercises.filter(ex => 
    ex.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
  );

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
                <div className="space-y-2 pt-2">
                  <Label>Exercises</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto rounded-md border p-2">
                    {selectedExercises.length > 0 ? (
                      selectedExercises.map((exercise, index) => (
                        <div key={exercise.name} className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => handleMoveExercise(index, -1)}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => handleMoveExercise(index, 1)}
                                disabled={index === selectedExercises.length - 1}
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-medium">{exercise.name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={exercise.sets}
                              onChange={(e) => handleSetsChange(exercise.name, parseInt(e.target.value, 10))}
                              className="w-16 h-8 text-center"
                              aria-label={`Sets for ${exercise.name}`}
                            />
                            <span className="text-muted-foreground">sets</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveExercise(exercise.name)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground px-2 py-8 text-center">
                        <p>No exercises added yet.</p>
                      </div>
                    )}
                  </div>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setExercisePickerOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exercises
                  </Button>
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
        <Card>
          <CardHeader>
            <CardTitle>My Templates</CardTitle>
          </CardHeader>
          <CardContent>
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
              <div className="space-y-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader className="flex flex-row items-start justify-between pb-2 gap-4">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.user_id !== user?.id && <p className="text-xs text-muted-foreground">Shared template</p>}
                      </div>
                      <div className="flex items-center space-x-2">
                         <Button variant="ghost" size="icon" onClick={() => handleStartWorkout(template)}>
                          <Play className="h-5 w-5 text-primary" />
                        </Button>
                        {template.user_id === user?.id && (
                          <DeleteConfirmationDialog
                            onConfirm={() => handleDeleteTemplate(template.id)}
                            isLoading={deleteTemplateMutation.isPending && deleteTemplateMutation.variables === template.id}
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm mb-4">
                        {template.exercises.map((ex) => (
                          <li key={ex.name} className="flex justify-between">
                            <span>{ex.name}</span>
                            <span className="text-muted-foreground">{ex.sets} sets</span>
                          </li>
                        ))}
                      </ul>
                      {template.user_id === user?.id && (
                        <div className="flex items-center space-x-2 pt-4 border-t">
                          <Switch
                            id={`is-public-${template.id}`}
                            checked={template.is_public}
                            onCheckedChange={() => handleTogglePublic(template)}
                            disabled={updateTemplateMutation.isPending && updateTemplateMutation.variables?.id === template.id}
                          />
                          <Label htmlFor={`is-public-${template.id}`}>
                            {template.is_public ? "Public (shared)" : "Private"}
                          </Label>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                You don't have any workout templates yet. Create one to get started!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isExercisePickerOpen} onOpenChange={setExercisePickerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Exercises to Template</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Input
              placeholder="Search exercises..."
              value={exerciseSearchTerm}
              onChange={(e) => setExerciseSearchTerm(e.target.value)}
            />
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="p-4">
                {filteredPickerExercises.length > 0 ? (
                  filteredPickerExercises.map((exercise) => (
                    <div key={exercise.name} className="flex items-center space-x-3 my-3">
                      <Checkbox
                        id={`picker-${exercise.name}`}
                        checked={pickerSelectedExercises.has(exercise.name)}
                        onCheckedChange={(checked) => {
                          setPickerSelectedExercises((prev) => {
                            const newSet = new Set(prev);
                            if (checked) {
                              newSet.add(exercise.name);
                            } else {
                              newSet.delete(exercise.name);
                            }
                            return newSet;
                          });
                        }}
                      />
                      <label
                        htmlFor={`picker-${exercise.name}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {exercise.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center">No exercises found.</p>
                )}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setExercisePickerOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddSelectedExercises}>Add Selected</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkoutTemplatesPage;
