import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SimpleExerciseSelector } from '@/components/workout/SimpleExerciseSelector';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

interface CreateRitualModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateRitualModal = ({ open, onOpenChange }: CreateRitualModalProps) => {
  const [ritualName, setRitualName] = useState('');
  const [description, setDescription] = useState('');
  const [capabilityPath, setCapabilityPath] = useState('Strength');
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: 3, reps: 10 }
  ]);
  const [nameError, setNameError] = useState(false);

  const queryClient = useQueryClient();

  const createRitualMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      exercises: Exercise[];
    }) => {
      // Create the template
      const { data: template, error: templateError } = await supabase
        .from('workout_templates')
        .insert({
          name: data.name,
          is_public: false
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Create the exercises
      const exerciseInserts = data.exercises
        .filter(ex => ex.name.trim())
        .map((exercise, index) => ({
          workout_template_id: template.id,
          exercise_name: exercise.name,
          sets: exercise.sets,
          order: index
        }));

      if (exerciseInserts.length > 0) {
        const { error: exerciseError } = await supabase
          .from('workout_template_exercises')
          .insert(exerciseInserts);

        if (exerciseError) throw exerciseError;
      }

      return template;
    },
    onSuccess: () => {
      toast.success('Ritual created successfully!');
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
      handleClose();
    },
    onError: (error) => {
      console.error('Error creating ritual:', error);
      toast.error('Failed to create ritual. Please try again.');
    }
  });

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10 }]);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const updated = exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const handleClose = () => {
    setRitualName('');
    setDescription('');
    setCapabilityPath('Strength');
    setExercises([{ name: '', sets: 3, reps: 10 }]);
    setNameError(false);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!ritualName.trim()) {
      setNameError(true);
      return;
    }

    const validExercises = exercises.filter(ex => ex.name.trim());
    
    createRitualMutation.mutate({
      name: ritualName,
      description: description,
      exercises: validExercises
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-2xl font-bold text-primary">Create New Ritual</DialogTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Ritual Name */}
          <div className="space-y-2">
            <Label htmlFor="ritual-name">Ritual Name</Label>
            <Input
              id="ritual-name"
              placeholder="e.g. Thor's Thunder"
              value={ritualName}
              onChange={(e) => {
                setRitualName(e.target.value);
                setNameError(false);
              }}
              className={nameError ? 'border-destructive' : ''}
            />
            {nameError && (
              <p className="text-sm text-destructive">Please fill in this field.</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your ritual..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Capability Path */}
          <div className="space-y-2">
            <Label>Capability Path</Label>
            <Select value={capabilityPath} onValueChange={setCapabilityPath}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Strength">Strength</SelectItem>
                <SelectItem value="Endurance">Endurance</SelectItem>
                <SelectItem value="Mobility">Mobility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exercises */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Exercises</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addExercise}
                className="text-primary border-primary hover:bg-primary/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise
              </Button>
            </div>

            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-6">
                        <Label className="text-sm text-muted-foreground">Exercise</Label>
                        <SimpleExerciseSelector
                          onExerciseSelect={(exerciseName) => updateExercise(index, 'name', exerciseName)}
                          trigger={
                            <Input
                              placeholder="e.g. Push-ups"
                              value={exercise.name}
                              onChange={(e) => updateExercise(index, 'name', e.target.value)}
                              className="cursor-pointer"
                              readOnly
                            />
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm text-muted-foreground">Sets</Label>
                        <Input
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm text-muted-foreground">Reps</Label>
                        <Input
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        {exercises.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExercise(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createRitualMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {createRitualMutation.isPending ? 'Creating...' : 'Create Ritual'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};