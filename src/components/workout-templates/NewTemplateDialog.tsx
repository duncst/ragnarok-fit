
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { ExercisePicker } from "./ExercisePicker";
import { SelectedExercisesList } from "./SelectedExercisesList";

interface NewTemplateDialogProps {
    onTemplateCreated: (template: WorkoutTemplate) => void;
}

export const NewTemplateDialog = ({ onTemplateCreated }: NewTemplateDialogProps) => {
    const [open, setOpen] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const { toast } = useToast();
    const [selectedExercises, setSelectedExercises] = useState<TemplateExercise[]>([]);
    const [isExercisePickerOpen, setExercisePickerOpen] = useState(false);

    useEffect(() => {
        if (!open) {
          setTemplateName("");
          setSelectedExercises([]);
        }
      }, [open]);

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
        const newTemplate: WorkoutTemplate = {
            id: new Date().toISOString(),
            name: templateName,
            exercises: selectedExercises,
        };
        onTemplateCreated(newTemplate);

        toast({
            title: "Success",
            description: `Template "${templateName}" created.`,
        });
        setOpen(false);
    };

    const handleAddSelectedExercises = (pickerSelectedNames: Set<string>) => {
        const newSelectedExercises = allExercises
          .filter((ex) => pickerSelectedNames.has(ex.name))
          .map((ex) => {
            const existingExercise = selectedExercises.find(
              (selectedEx) => selectedEx.name === ex.name
            );
            return existingExercise || { ...ex, sets: 3 };
          });
        
        const finalExercises = newSelectedExercises.filter(ex => pickerSelectedNames.has(ex.name));
        setSelectedExercises(finalExercises);
    };
    
    const handleRemoveExercise = (exerciseName: string) => {
        setSelectedExercises(prev => prev.filter(ex => ex.name !== exerciseName));
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

    return (
        <>
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
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. Push Day"
                        />
                    </div>
                    <div className="space-y-2 pt-2">
                        <Label>Exercises</Label>
                        <div className="space-y-2 max-h-64 overflow-y-auto rounded-md border p-2">
                            <SelectedExercisesList 
                                exercises={selectedExercises}
                                onRemove={handleRemoveExercise}
                                onSetsChange={handleSetsChange}
                                onMove={handleMoveExercise}
                            />
                        </div>
                        <Button type="button" variant="outline" className="w-full" onClick={() => setExercisePickerOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Exercises
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleCreateTemplate}>Create</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>

            <ExercisePicker 
                isOpen={isExercisePickerOpen}
                onOpenChange={setExercisePickerOpen}
                onAddExercises={handleAddSelectedExercises}
                initiallySelected={new Set(selectedExercises.map(e => e.name))}
            />
        </>
    );
};
