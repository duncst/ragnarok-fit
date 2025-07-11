import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Trophy, Calendar, RotateCcw, Calculator } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import type { PersonalRecord } from '@/types';

const MAJOR_LIFTS = [
  'bench press',
  'bent over row',
  'squat',
  'deadlift',
  'pullups'
];

const PersonalRecordsSection = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const queryClient = useQueryClient();
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

  // Process personal records to separate 1RM and Valhalla scores
  const oneRepMaxRecords = personalRecords?.filter(pr => !pr.exercise_name.includes('(Valhalla)')) || [];
  const valhallaRecords = personalRecords?.filter(pr => pr.exercise_name.includes('(Valhalla)')) || [];

  // Format records for display
  const formatPRsForDisplay = (records: PersonalRecord[], isValhalla: boolean = false) => {
    return records.map(pr => ({
      exercise: pr.exercise_name,
      value: isValhalla 
        ? `${Number(pr.one_rep_max).toFixed(1)}` 
        : `${Number(pr.one_rep_max).toFixed(1)} kg`,
      date: format(new Date(pr.date), 'yyyy-MM-dd'),
      type: isValhalla ? 'valhalla' : 'weight'
    }));
  };

  const allPRsForDisplay = [
    ...formatPRsForDisplay(oneRepMaxRecords, false),
    ...formatPRsForDisplay(valhallaRecords, true)
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  // Get current PR for selected exercise
  const getCurrentPR = (exerciseName: string) => {
    return personalRecords.find(pr => pr.exercise_name.toLowerCase() === exerciseName.toLowerCase());
  };

  // Reset personal record
  const resetPersonalRecord = async (exerciseName: string) => {
    try {
      const { error } = await supabase
        .from('personal_records')
        .delete()
        .eq('exercise_name', exerciseName);

      if (error) throw error;

      toast.success('Personal record reset successfully');
      queryClient.invalidateQueries({ queryKey: ['personalRecords'] });
      setSelectedExercise(null); // Close dialog after reset
    } catch (error) {
      console.error('Error resetting personal record:', error);
      toast.error('Failed to reset personal record');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
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
          Click any record to view progression chart
        </p>
      </div>

      {/* All Personal Records Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="text-primary" />
              All Personal Records
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/1rm-calculator">
                <Calculator className="mr-2 h-4 w-4" />
                Calculator
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="space-y-2 pt-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exercise</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPRsForDisplay.length > 0 ? (
                    (showAllRecords ? allPRsForDisplay : allPRsForDisplay.slice(0, 5)).map((item, index) => (
                      <TableRow 
                        key={`${item.exercise}-${index}`}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedExercise(item.exercise)}
                      >
                        <TableCell className="font-medium">{item.exercise}</TableCell>
                        <TableCell className="text-center">
                          {item.type === 'valhalla' ? (
                            <span className="inline-flex items-center text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                              ⚔️ Valhalla
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              💪 1RM
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{item.value}</TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs">{item.date}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No personal records yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {allPRsForDisplay.length > 5 && (
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAllRecords(!showAllRecords)}
                  >
                    {showAllRecords ? 'Show Less' : `Show All (${allPRsForDisplay.length})`}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Progress Dialog */}
      {selectedExercise && (
        <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="capitalize">{selectedExercise} Progression</span>
                {getCurrentPR(selectedExercise) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset PR
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Personal Record</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reset your personal record for {selectedExercise}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => resetPersonalRecord(selectedExercise)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {getCurrentPR(selectedExercise) && (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold">Current PR</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {getCurrentPR(selectedExercise)?.one_rep_max.toFixed(1)}
                    {selectedExercise.includes('(Valhalla)') ? '' : 'kg'}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(getCurrentPR(selectedExercise)?.date || ''), 'MMMM dd, yyyy')}
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
                        label={{ value: selectedExercise.includes('(Valhalla)') ? 'Score' : 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value) => [selectedExercise.includes('(Valhalla)') ? `${value}` : `${value}kg`, 'Est. 1RM']}
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
                      <p className="text-sm">Complete workouts with {selectedExercise} to see your progress</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PersonalRecordsSection;