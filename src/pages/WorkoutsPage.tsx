
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Footprints, Plus, Calendar, TrendingUp, Zap, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { StrengthChart } from "@/components/StrengthChart";
import { RunChart } from "@/components/RunChart";

const StatItem = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
  <div className="flex items-start gap-3">
    <div className="bg-secondary p-2 rounded-lg">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </div>
);

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="text-primary" />
            Strength Training
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <CardTitle className="flex items-center gap-2">
            <Footprints className="text-primary" />
            Running
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatItem icon={Calendar} value={18} label="Total Runs" />
            <StatItem icon={Target} value={4} label="This Week" />
            <StatItem icon={Zap} value="140.5" label="Total Distance" />
            <StatItem icon={TrendingUp} value="4:47" label="Best Pace" />
          </div>
          <RunChart />
        </CardContent>
      </Card>
      
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
