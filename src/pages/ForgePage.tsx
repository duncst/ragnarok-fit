
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import ForgeProgressSection from '@/components/forge/ForgeProgressSection';
import BeholdYourDeedsSection from '@/components/forge/BeholdYourDeedsSection';
import ForgeQuoteSection from '@/components/forge/ForgeQuoteSection';
import ValhallaPreviewSection from '@/components/forge/ValhallaPreviewSection';

const ForgePage = () => {
  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["daily-progress", "monthly-calendar"]} className="w-full space-y-4">
        <ForgeProgressSection />
        <BeholdYourDeedsSection />
      </Accordion>

      <ForgeQuoteSection />
      <ValhallaPreviewSection />
    </div>
  );
};

export default ForgePage;
