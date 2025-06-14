
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import type { TemplateExercise } from "@/types";

interface SelectedExercisesListProps {
    exercises: TemplateExercise[];
    onRemove: (name: string) => void;
    onSetsChange: (name: string, sets: number) => void;
    onMove: (index: number, direction: 1 | -1) => void;
}

export const SelectedExercisesList = ({ exercises, onRemove, onSetsChange, onMove }: SelectedExercisesListProps) => {
    if (exercises.length === 0) {
        return (
            <div className="text-sm text-muted-foreground px-2 py-8 text-center">
                <p>No exercises added yet.</p>
            </div>
        );
    }
    return (
        <>
            {exercises.map((exercise, index) => (
                <div key={exercise.name} className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => onMove(index, -1)}
                                disabled={index === 0}
                            >
                                <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => onMove(index, 1)}
                                disabled={index === exercises.length - 1}
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
                            onChange={(e) => onSetsChange(exercise.name, parseInt(e.target.value, 10))}
                            className="w-16 h-8 text-center"
                            aria-label={`Sets for ${exercise.name}`}
                        />
                        <span className="text-muted-foreground">sets</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(exercise.name)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </>
    );
}
