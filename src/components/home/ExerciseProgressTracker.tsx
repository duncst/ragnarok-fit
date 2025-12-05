import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExerciseProgressHistory } from '@/hooks/useExerciseProgressHistory';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, Dumbbell } from 'lucide-react';

const TRACKED_EXERCISES = [
  'Bench Press',
  'Squat',
  'Deadlifts',
  'Overhead Press',
  'Barbell Rows',
  'Pull-ups',
  'Dips',
  'Chin-ups',
  'Romanian Deadlifts',
  'Leg Press',
  'Incline Bench Press',
  'Single Arm Press',
];

export const ExerciseProgressTracker = () => {
  const [selectedExercise, setSelectedExercise] = useState('Bench Press');
  const { sessions, isLoading } = useExerciseProgressHistory(selectedExercise);

  const chartData = useMemo(() => {
    return sessions.map((session) => ({
      date: format(new Date(session.date), 'MMM d'),
      fullDate: format(new Date(session.date), 'MMM d, yyyy'),
      volume: session.volume,
      estimated1RM: session.estimated1RM,
      sets: session.totalSets,
    }));
  }, [sessions]);

  const latestSession = sessions[sessions.length - 1];
  const previousSession = sessions[sessions.length - 2];
  
  const volumeChange = latestSession && previousSession
    ? ((latestSession.volume - previousSession.volume) / previousSession.volume * 100).toFixed(1)
    : null;
  
  const e1rmChange = latestSession && previousSession
    ? ((latestSession.estimated1RM - previousSession.estimated1RM) / previousSession.estimated1RM * 100).toFixed(1)
    : null;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Exercise Progress
          </CardTitle>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select exercise" />
            </SelectTrigger>
            <SelectContent>
              {TRACKED_EXERCISES.map((exercise) => (
                <SelectItem key={exercise} value={exercise}>
                  {exercise}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Dumbbell className="h-8 w-8 opacity-50" />
            <p>No {selectedExercise} history found</p>
            <p className="text-sm">Complete some workouts to see your progress</p>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Est. 1RM</p>
                <p className="text-xl font-bold">
                  {latestSession?.estimated1RM.toFixed(1)} kg
                </p>
                {e1rmChange && (
                  <p className={`text-xs ${parseFloat(e1rmChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {parseFloat(e1rmChange) >= 0 ? '+' : ''}{e1rmChange}% vs last
                  </p>
                )}
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Last Volume</p>
                <p className="text-xl font-bold">
                  {latestSession?.volume.toLocaleString()} kg
                </p>
                {volumeChange && (
                  <p className={`text-xs ${parseFloat(volumeChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {parseFloat(volumeChange) >= 0 ? '+' : ''}{volumeChange}% vs last
                  </p>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    className="fill-muted-foreground"
                  />
                  <YAxis 
                    yAxisId="volume" 
                    orientation="left" 
                    tick={{ fontSize: 10 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis 
                    yAxisId="e1rm" 
                    orientation="right" 
                    tick={{ fontSize: 10 }}
                    className="fill-muted-foreground"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.fullDate;
                      }
                      return label;
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'volume') return [`${value.toLocaleString()} kg`, 'Volume'];
                      if (name === 'estimated1RM') return [`${value} kg`, 'Est. 1RM'];
                      return [value, name];
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                    formatter={(value) => {
                      if (value === 'volume') return 'Volume (kg)';
                      if (value === 'estimated1RM') return 'Est. 1RM (kg)';
                      return value;
                    }}
                  />
                  <Bar 
                    yAxisId="volume"
                    dataKey="volume" 
                    fill="hsl(var(--primary) / 0.6)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="e1rm"
                    type="monotone" 
                    dataKey="estimated1RM" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))', r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {sessions.length} sessions tracked
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
