
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface PersonalRecord {
  id: string;
  exercise_name: string;
  one_rep_max: number;
  date: string;
}

interface ValhallaScore {
  id: string;
  workout_id: string;
  score_seconds: number;
  notes: string | null;
  created_at: string;
}

const valhallaWorkouts = [
  { id: "thor", name: "THOR", icon: "⚡" },
  { id: "fenrir", name: "FENRIR", icon: "🐺" },
  { id: "hel", name: "HEL", icon: "🧊" },
  { id: "njord", name: "NJORD", icon: "🌊" },
  { id: "odin", name: "ODIN", icon: "🧠" },
];

export const StrengthChart = () => {
  const { user } = useAuth();

  const { data: personalRecords, isLoading: isLoadingPRs } = useQuery<PersonalRecord[]>({
    queryKey: ['personal-records', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: valhallaScores, isLoading: isLoadingScores } = useQuery<ValhallaScore[]>({
    queryKey: ['valhalla-scores', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('valhalla_scores')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getWorkoutInfo = (workoutId: string) => {
    return valhallaWorkouts.find(w => w.id === workoutId) || { name: workoutId.toUpperCase(), icon: "⚔️" };
  };

  if (isLoadingPRs && isLoadingScores) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">1 Rep Max Records</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {personalRecords && personalRecords.length > 0 ? (
            <div className="space-y-3">
              {personalRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{record.exercise_name}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(record.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold">{record.one_rep_max}</span>
                    <span className="text-sm text-muted-foreground">lbs</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No personal records yet</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valhalla Scores</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {valhallaScores && valhallaScores.length > 0 ? (
            <div className="space-y-3">
              {valhallaScores.map((score) => {
                const workoutInfo = getWorkoutInfo(score.workout_id);
                return (
                  <div key={score.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{workoutInfo.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{workoutInfo.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(score.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="text-lg font-bold">{formatTime(score.score_seconds)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No Valhalla scores yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
