
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
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
import type { ExerciseDef } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const WorkoutTemplatesPage = () => {
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const { toast } = useToast();
  const [selectedExercises, setSelectedExercises] = useState<ExerciseDef[]>([]);
  const [isExercisePickerOpen, setExercisePickerOpen] = useState(false);
  const [pickerSelectedExercises, setPickerSelectedExercises] = useState<Set<string>>(new Set());
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState("");

  useEffect(() => {
    if (!open) {
      setTemplateName("");
      setSelectedExercises([]);
    }
  }, [open]);

  useEffect(() => {
    if (isExercisePickerOpen) {
      setPickerSelectedExercises(new Set(selectedExercises.map(e => e.name)));
      setExerciseSearchTerm("");
    }
  }, [isExercisePickerOpen, selectedExercises]);

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
    // In a real app, you'd save this to a database.
    console.log("Creating template:", templateName, "with exercises:", selectedExercises.map(e => e.name));
    toast({
      title: "Success",
      description: `Template "${templateName}" created.`,
    });
    setOpen(false);
  };
  
  const handleRemoveExercise = (exerciseName: string) => {
    setSelectedExercises(prev => prev.filter(ex => ex.name !== exerciseName));
  };
  
  const handleAddSelectedExercises = () => {
    const exercisesToAdd = allExercises.filter(ex => pickerSelectedExercises.has(ex.name));
    setSelectedExercises(exercisesToAdd);
    setExercisePickerOpen(false);
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
                <div className="space-y-2 pt-2">
                  <Label>Exercises</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto rounded-md border p-2">
                    {selectedExercises.length > 0 ? (
                      selectedExercises.map((exercise) => (
                        <div key={exercise.name} className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                          <span className="text-sm font-medium">{exercise.name}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveExercise(exercise.name)}>
                            <X className="h-4 w-4" />
                          </Button>
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
                <Button type="submit" onClick={handleCreateTemplate}>
                  Create
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
            <p className="text-muted-foreground">
              You don't have any workout templates yet.
            </p>
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
            <Button type="button" onClick={handleAddSelectedExercises}>Add Exercises</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkoutTemplatesPage;
