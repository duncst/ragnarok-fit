import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Trophy, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface PersonalRecord {
  id: string;
  exercise_name: string;
  one_rep_max: number;
  date: string;
  created_at: string;
}

const MAJOR_LIFTS = [
  { name: 'bench press', icon: '🏋️' },
  { name: 'bent over row', icon: '🚣' },
  { name: 'squat', icon: '🦵' },
  { name: 'deadlift', icon: '⚡' },
  { name: 'pullups', icon: '💪' }
];

const PersonalRecordsSection = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  // Fetch all personal records
  const { data: personalRecords = [], isLoading } = useQuery({
    queryKey: ['personalRecords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .order('exercise_name', { ascending: true });
      
      if (error) throw error;
      return data as PersonalRecord[];
    }
  });

  // Fetch progression data for selected exercise
  const { data: progressionData = [], isLoading: isLoadingProgression } = useQuery({
    queryKey: ['exerciseProgression', selectedExercise],
    queryFn: async () => {
      if (!selectedExercise) return [];
      
      // Get all workout sets for the selected exercise to build progression
      const { data, error } = await supabase
        .from('workout_sets')
        .select(`
          weight,
          reps,
          completed,
          workout_exercises!inner(
            name,
            workouts!inner(
              start_time,
              end_time
            )
          )
        `)
        .eq('workout_exercises.name', selectedExercise)
        .eq('completed', true)
        .not('workout_exercises.workouts.end_time', 'is', null)
        .order('workout_exercises.workouts.start_time', { ascending: true });

      if (error) throw error;

      // Calculate 1RM for each set and group by date
      const progressionMap = new Map();
      
      data?.forEach((set: any) => {
        const date = format(new Date(set.workout_exercises.workouts.start_time), 'yyyy-MM-dd');
        const oneRepMax = set.reps === 1 ? set.weight : set.weight * (1 + set.reps / 30);
        
        if (!progressionMap.has(date) || progressionMap.get(date) < oneRepMax) {
          progressionMap.set(date, oneRepMax);
        }
      });

      return Array.from(progressionMap.entries())
        .map(([date, oneRepMax]) => ({
          date,
          oneRepMax: Number(oneRepMax.toFixed(1)),
          formattedDate: format(new Date(date), 'MMM dd')
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    enabled: !!selectedExercise
  });

  // Get current PR for each exercise
  const getCurrentPR = (exerciseName: string) => {
    return personalRecords.find(pr => pr.exercise_name.toLowerCase() === exerciseName.toLowerCase());
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MAJOR_LIFTS.map((lift) => (
            <Skeleton key={lift.name} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Personal Records</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Track your strength progression across major lifts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MAJOR_LIFTS.map((lift) => {
          const pr = getCurrentPR(lift.name);
          
          return (
            <Dialog key={lift.name}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors border-muted">
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <div className="text-2xl">{lift.icon}</div>
                      <div>
                        <h4 className="font-semibold text-foreground capitalize">
                          {lift.name}
                        </h4>
                        {pr ? (
                          <div className="space-y-1">
                            <Badge variant="secondary" className="bg-primary/20 text-foreground">
                              {pr.one_rep_max}kg
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(pr.date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No PR yet</p>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        View Progress
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 capitalize">
                    <span className="text-2xl">{lift.icon}</span>
                    {lift.name} Progression
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {pr && (
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">Current PR</span>
                      </div>
                      <div className="text-3xl font-bold text-primary">{pr.one_rep_max}kg</div>
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(pr.date), 'MMMM dd, yyyy')}
                      </div>
                    </div>
                  )}

                  <div className="h-64">
                    {isLoadingProgression ? (
                      <div className="flex items-center justify-center h-full">
                        <Skeleton className="w-full h-full" />
                      </div>
                    ) : progressionData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={progressionData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis 
                            dataKey="formattedDate" 
                            fontSize={12}
                            className="text-muted-foreground"
                          />
                          <YAxis 
                            fontSize={12}
                            className="text-muted-foreground"
                            label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value}kg`, 'Est. 1RM']}
                            labelFormatter={(label) => `Date: ${label}`}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="oneRepMax" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center space-y-2">
                          <TrendingUp className="h-8 w-8 mx-auto opacity-50" />
                          <p>No progression data yet</p>
                          <p className="text-sm">Complete workouts with {lift.name} to see your progress</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalRecordsSection;