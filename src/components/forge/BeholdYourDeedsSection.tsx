import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MonthlyActivityCalendar } from './MonthlyActivityCalendar';
import PersonalRecordsSection from './PersonalRecordsSection';
import ForgeWorkoutHistory from './ForgeWorkoutHistory';
import deedsIcon from '@/assets/deeds-icon.png';

const BeholdYourDeedsSection = () => {
  return (
    <AccordionItem value="monthly-calendar" className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30 rounded-lg">
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex items-center gap-2">
          <img src={deedsIcon} alt="Scroll icon" className="h-5 w-5" />
          <span className="text-foreground text-xl font-bold">Behold your Deeds</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6 space-y-8">
        <MonthlyActivityCalendar />
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Activities</h3>
          <ForgeWorkoutHistory />
        </div>
        <PersonalRecordsSection />
      </AccordionContent>
    </AccordionItem>
  );
};

export default BeholdYourDeedsSection;