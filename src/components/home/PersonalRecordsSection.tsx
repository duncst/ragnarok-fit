
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

export const PersonalRecordsSection = ({ personalRecords, isLoading }: PersonalRecordsSectionProps) => {
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
