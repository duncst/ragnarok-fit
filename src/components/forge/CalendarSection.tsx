import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CalendarCheck, ChevronDown } from "lucide-react";
import { MonthlyActivityCalendar } from "./MonthlyActivityCalendar";
import ForgeWorkoutHistory from "./ForgeWorkoutHistory";
import { useState } from 'react';

export const CalendarSection = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Collapsible open={calendarOpen} onOpenChange={setCalendarOpen}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <CalendarCheck className="h-7 w-7 text-primary" />
                Behold your Deeds
              </CardTitle>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${calendarOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <MonthlyActivityCalendar />
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Activities</h3>
              <ForgeWorkoutHistory />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};