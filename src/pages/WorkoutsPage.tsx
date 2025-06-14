
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const workoutHistory = [
  { id: 1, name: "Push Day", date: "2025-06-12" },
  { id: 2, name: "Leg Day", date: "2025-06-10" },
];

const WorkoutsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workouts</h1>
        <Button asChild size="lg">
          <Link to="/workout/new">
            <Plus className="mr-2 h-5 w-5" /> Start Workout
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workoutHistory.map((workout) => (
              <div key={workout.id} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <div>
                  <p className="font-semibold">{workout.name}</p>
                  <p className="text-sm text-muted-foreground">{workout.date}</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutsPage;
