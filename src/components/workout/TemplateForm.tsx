import { useState, useEffect } from "react";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { exercises as allExercises } from "@/data/exercises";
import type { TemplateExercise } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useTemplateOperations } from "@/hooks/useTemplateOperations";

interface TemplateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const TemplateForm = ({ open, onOpenChange, onSuccess }: TemplateFormProps) => {
  const { toast } = useToast();
  const { createTemplateMutation } = useTemplateOperations();
  
  const [templateName, setTemplateName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<TemplateExercise[]>([]);
  const [isExercisePickerOpen, setExercisePickerOpen] = useState(false);
  const [pickerSelectedExercises, setPickerSelectedExercises] = useState<Set<string>>(new Set());
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState("");
  const [isPublic, setIsPublic] = useState(false);

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

  useEffect(() => {
    if (createTemplateMutation.isSuccess) {
      onOpenChange(false);
      onSuccess?.();
    }
  }, [createTemplateMutation.isSuccess, onOpenChange, onSuccess]);

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
        return existingExercise || { ...ex, sets: 3, suggestedReps: 8 };
      });
    
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

  const handleSuggestedRepsChange = (exerciseName: string, suggestedReps: number) => {
    setSelectedExercises(currentExercises =>
      currentExercises.map(ex =>
        ex.name === exerciseName ? { ...ex, suggestedReps: isNaN(suggestedReps) || suggestedReps < 1 ? 1 : suggestedReps } : ex
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

  const filteredPickerExercises = allExercises.filter(ex => 
    ex.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
  );

  return (
    <>
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
                      <span className="text-muted-foreground text-xs">sets</span>
                      <Input
                        type="number"
                        min="1"
                        value={exercise.suggestedReps || 8}
                        onChange={(e) => handleSuggestedRepsChange(exercise.name, parseInt(e.target.value, 10))}
                        className="w-16 h-8 text-center"
                        aria-label={`Suggested reps for ${exercise.name}`}
                      />
                      <span className="text-muted-foreground text-xs">reps</span>
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

      {/* Exercise Picker Dialog */}
      <Dialog open={isExercisePickerOpen} onOpenChange={setExercisePickerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Exercises</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search exercises..."
              value={exerciseSearchTerm}
              onChange={(e) => setExerciseSearchTerm(e.target.value)}
            />
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredPickerExercises.map((exercise) => (
                  <div key={exercise.name} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                    <Checkbox
                      id={exercise.name}
                      checked={pickerSelectedExercises.has(exercise.name)}
                      onCheckedChange={(checked) => {
                        const newSet = new Set(pickerSelectedExercises);
                        if (checked) {
                          newSet.add(exercise.name);
                        } else {
                          newSet.delete(exercise.name);
                        }
                        setPickerSelectedExercises(newSet);
                      }}
                    />
                    <Label htmlFor={exercise.name} className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {exercise.targetMuscles.join(", ")} • {exercise.bodyPart}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddSelectedExercises}>
              Add {pickerSelectedExercises.size} Exercise{pickerSelectedExercises.size !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};