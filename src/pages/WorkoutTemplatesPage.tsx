
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const WorkoutTemplatesPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workout Templates</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You don't have any workout templates yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutTemplatesPage;
