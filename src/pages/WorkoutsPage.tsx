
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Footprints, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const recentActivity = [
  { id: 1, type: "workout", name: "Push Day", date: "Yesterday", details: "5 exercises • 1h 5m" },
  { id: 2, type: "run", name: "Morning Run", date: "2 days ago", details: "5.2 km • 28m" },
];

const WorkoutsPage = () => {
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
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary p-3 rounded-full">
                    {activity.type === 'workout' ? <Dumbbell className="h-5 w-5 text-primary" /> : <Footprints className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-semibold">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                </div>
                 <Button variant="ghost" size="icon">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

export default WorkoutsPage;
