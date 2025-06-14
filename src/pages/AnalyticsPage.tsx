
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Footprints, Calendar, TrendingUp, Zap, Target } from "lucide-react";
import { StrengthChart } from "@/components/StrengthChart";
import { RunChart } from "@/components/RunChart";
import { StatItem } from "@/components/StatItem";

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
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
    </div>
  );
};

export default AnalyticsPage;
