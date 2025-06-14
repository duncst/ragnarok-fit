import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Footprints, Plus, ArrowRight, Calendar, TrendingUp, Zap, Target, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { StrengthChart } from "@/components/StrengthChart";
import { RunChart } from "@/components/RunChart";
import { StatItem } from "@/components/StatItem";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecentActivity } from "@/components/RecentActivity";

const recentActivity = [
  { id: 1, type: "workout", name: "Push Day", date: "Yesterday", details: "5 exercises • 1h 5m" },
  { id: 2, type: "run", name: "Morning Run", date: "2 days ago", details: "5.2 km • 28m" },
];

const oneRepMaxes = [
    { exercise: "Bench Press", weight: "100 kg", date: "2025-06-10" },
    { exercise: "Squat", weight: "140 kg", date: "2025-06-01" },
    { exercise: "Deadlift", weight: "180 kg", date: "2025-05-25" },
    { exercise: "Overhead Press", weight: "60 kg", date: "2025-06-12" },
];

const HomePage = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Button asChild className="bg-green-500 hover:bg-green-600 text-primary-foreground">
          <Link to="/run">
            <Footprints className="mr-2 h-5 w-5" /> Start Run
          </Link>
        </Button>
        <Button asChild>
          <Link to="/workout/new">
            <Plus className="mr-2 h-5 w-5" /> Start Workout
          </Link>
        </Button>
      </div>
      
      <RecentActivity />

      <div>
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Dumbbell className="text-primary" />
                Strength Training
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-4">
                <StatItem icon={Calendar} value={24} label="Workouts" />
                <StatItem icon={Target} value={3} label="This Week" />
                <StatItem icon={TrendingUp} value={12} label="PR's Set" />
                <StatItem icon={Zap} value="204K" label="Total Volume" />
              </div>
              <StrengthChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Footprints className="text-primary" />
                Running
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-4">
                <StatItem icon={Calendar} value={18} label="Total Runs" />
                <StatItem icon={Target} value={4} label="This Week" />
                <StatItem icon={Zap} value="140.5" label="Total Distance" />
                <StatItem icon={TrendingUp} value="4:47" label="Best Pace" />
              </div>
              <RunChart />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <TrendingUp className="text-primary" />
                        1 Rep Max PRs
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
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Exercise</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {oneRepMaxes.map(item => (
                            <TableRow key={item.exercise}>
                                <TableCell className="font-medium">{item.exercise}</TableCell>
                                <TableCell className="text-right">{item.weight}</TableCell>
                                <TableCell className="text-right text-muted-foreground text-xs">{item.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
