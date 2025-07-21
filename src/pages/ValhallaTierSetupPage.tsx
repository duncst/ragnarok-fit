import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ValhallaTierSelector } from '@/components/valhalla/ValhallaTierSelector';
import type { WorkoutTemplate } from '@/types';

type ValhallaTier = 'Adept' | 'Warrior' | 'Berserker';

const ValhallaTierSetupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTier, setSelectedTier] = useState<ValhallaTier>('Warrior');
  
  const valhallaWorkout = location.state?.valhallaWorkout;
  
  if (!valhallaWorkout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">Valhalla workout not found</p>
          <button 
            onClick={() => navigate('/workout/new')}
            className="text-primary hover:underline"
          >
            Return to workouts
          </button>
        </div>
      </div>
    );
  }

  const handleStartWorkout = () => {
    const template: WorkoutTemplate = {
      id: valhallaWorkout.id,
      name: valhallaWorkout.name,
      exercises: valhallaWorkout.exercises,
      user_id: "valhalla",
      is_public: true,
      created_at: new Date().toISOString(),
    };
    
    navigate(`/ritual/valhalla-${valhallaWorkout.id}/workout`, { 
      state: { 
        template,
        templateName: valhallaWorkout.name,
        isValhalla: true,
        selectedTier
      } 
    });
  };

  const handleGoBack = () => {
    navigate('/workout/new');
  };

  return (
    <ValhallaTierSelector
      workoutName={valhallaWorkout.name}
      workoutIcon={valhallaWorkout.icon}
      godName={valhallaWorkout.godName}
      description={valhallaWorkout.description}
      theme={valhallaWorkout.theme}
      format={valhallaWorkout.format}
      tierThresholds={valhallaWorkout.tierThresholds}
      exercises={valhallaWorkout.exercises}
      selectedTier={selectedTier}
      onTierChange={setSelectedTier}
      onStartWorkout={handleStartWorkout}
      onGoBack={handleGoBack}
    />
  );
};

export default ValhallaTierSetupPage;