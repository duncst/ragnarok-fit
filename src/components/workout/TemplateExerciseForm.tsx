
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExerciseSelector } from '@/components/ExerciseSelector';
import { Plus, Trash2 } from 'lucide-react';
import type { TemplateExercise } from '@/types';

interface TemplateExerciseFormProps {
  exercises: TemplateExercise[];
  onExercisesChange: (exercises: TemplateExercise[]) => void;
}

export const TemplateExerciseForm = ({ exercises, onExercisesChange }: TemplateExerciseFormProps) => {
  const addExercise = () => {
    const newExercise: TemplateExercise = {
      name: '',
      sets: 3,
      suggestedReps: 8,
      bodyPart: '',
      equipment: '',
      targetMuscles: [],
      description: '',
    };
    onExercisesChange([...exercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    onExercisesChange(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof TemplateExercise, value: any) => {
    const updatedExercises = exercises.map((ex, i) => 
      i === index ? { ...ex, [field]: value } : ex
    );
    onExercisesChange(updatedExercises);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Exercises</h3>
        <Button onClick={addExercise} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      {exercises.map((exercise, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Exercise {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExercise(index)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`exercise-${index}`}>Exercise Name</Label>
              <ExerciseSelector
                placeholder="Select or type exercise name"
                value={exercise.name}
                onChange={(name) => updateExercise(index, 'name', name)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`sets-${index}`}>Number of Sets</Label>
                <Input
                  id={`sets-${index}`}
                  type="number"
                  min="1"
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 1)}
                  placeholder="3"
                />
              </div>
              <div>
                <Label htmlFor={`reps-${index}`}>Suggested Reps</Label>
                <Input
                  id={`reps-${index}`}
                  type="number"
                  min="1"
                  value={exercise.suggestedReps || ''}
                  onChange={(e) => updateExercise(index, 'suggestedReps', parseInt(e.target.value) || undefined)}
                  placeholder="8"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {exercises.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No exercises added yet.</p>
          <Button onClick={addExercise} variant="outline" className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Exercise
          </Button>
        </div>
      )}
    </div>
  );
};
