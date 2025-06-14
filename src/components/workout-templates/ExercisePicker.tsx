
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { exercises as allExercises } from "@/data/exercises";

interface ExercisePickerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAddExercises: (selected: Set<string>) => void;
    initiallySelected: Set<string>;
}

export const ExercisePicker = ({ isOpen, onOpenChange, onAddExercises, initiallySelected }: ExercisePickerProps) => {
    const [pickerSelectedExercises, setPickerSelectedExercises] = useState<Set<string>>(new Set());
    const [exerciseSearchTerm, setExerciseSearchTerm] = useState("");

    useEffect(() => {
        if(isOpen) {
            setPickerSelectedExercises(initiallySelected);
            setExerciseSearchTerm("");
        }
    }, [isOpen, initiallySelected]);

    const filteredPickerExercises = allExercises.filter(ex => 
        ex.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
    );

    const handleAdd = () => {
        onAddExercises(pickerSelectedExercises);
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                    Cancel
                    </Button>
                    <Button type="button" onClick={handleAdd}>Add Selected</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
