
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import type { PersonalRecord } from '@/types';

interface PersonalRecordsSectionProps {
  personalRecords?: PersonalRecord[];
  isLoading: boolean;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const PersonalRecordsSection = ({ personalRecords, isLoading }: PersonalRecordsSectionProps) => {
  // Process personal records to separate different types
  const strengthRecords = personalRecords?.filter(pr => 
    !pr.exercise_name.includes('(Valhalla)') && 
    !pr.exercise_name.includes('Run')
  ) || [];
  
  const runningRecords = personalRecords?.filter(pr => pr.exercise_name.includes('Run')) || [];
  const valhallaRecords = personalRecords?.filter(pr => pr.exercise_name.includes('(Valhalla)')) || [];

  // Format records for display
  const formatPRsForDisplay = (records: PersonalRecord[], type: 'strength' | 'running' | 'valhalla') => {
    return records.map(pr => {
      let value: string;
      let recordType: string;
      
      if (type === 'running') {
        // For running, the one_rep_max field stores pace per km in seconds
        const totalTime = Number(pr.one_rep_max) * parseFloat(pr.exercise_name.replace('k Run', ''));
        value = formatTime(Math.round(totalTime));
        recordType = 'running';
      } else if (type === 'valhalla') {
        value = `${Number(pr.one_rep_max).toFixed(1)}`;
        recordType = 'valhalla';
      } else {
        value = `${Number(pr.one_rep_max).toFixed(1)} kg`;
        recordType = 'strength';
      }
      
      return {
        exercise: pr.exercise_name,
        value,
        date: format(new Date(pr.date), 'yyyy-MM-dd'),
        type: recordType
      };
    });
  };

  const allPRsForDisplay = [
    ...formatPRsForDisplay(strengthRecords, 'strength'),
    ...formatPRsForDisplay(runningRecords, 'running'),
    ...formatPRsForDisplay(valhallaRecords, 'valhalla')
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="text-primary" />
            Personal Records
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
                allPRsForDisplay.slice(0, 5).map((item, index) => (
                  <TableRow key={`${item.exercise}-${index}`}>
                    <TableCell className="font-medium">{item.exercise}</TableCell>
                    <TableCell className="text-center">
                      {item.type === 'valhalla' ? (
                        <span className="inline-flex items-center text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          ⚔️ Valhalla
                        </span>
                      ) : item.type === 'running' ? (
                        <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          🏃 Running
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
        )}
      </CardContent>
    </Card>
  );
};
