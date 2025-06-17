
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exercises as allExercises } from '@/data/exercises';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';

const bodyParts = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body'];

const ExercisesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('All');

  const filteredExercises = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return allExercises
      .filter((exercise) =>
        selectedBodyPart === 'All' || exercise.bodyPart === selectedBodyPart
      )
      .filter((exercise) =>
        exercise.name.toLowerCase().includes(lowercasedTerm)
      );
  }, [searchTerm, selectedBodyPart]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exercises</h1>
      </div>
      
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4 -my-4 -mx-4 px-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-10 text-base h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex overflow-x-auto gap-2 pt-4 pb-1">
          {bodyParts.map((part) => (
            <Button
              key={part}
              variant={selectedBodyPart === part ? 'default' : 'secondary'}
              size="sm"
              className="shrink-0"
              onClick={() => setSelectedBodyPart(part)}
            >
              {part}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 pb-16">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.name}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <div className="flex gap-2 pt-1">
                    <Badge variant="secondary">{exercise.bodyPart}</Badge>
                    <Badge variant="outline">{exercise.equipment}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Plus className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Target Muscles</h4>
                  <p className="text-sm text-muted-foreground">{exercise.targetMuscles.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{exercise.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredExercises.length === 0 && (
          <p className="text-muted-foreground text-center col-span-full pt-8">No exercises found.</p>
        )}
      </div>
    </div>
  );
};

export default ExercisesPage;
