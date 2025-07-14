import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Swords, Flame, Clock, ChevronRight } from 'lucide-react';
import { HeroCallWorkout } from './WorkoutTemplates';

interface HeroCallChallengeProps {
  currentWorkout: HeroCallWorkout;
  selectedLevel: 'easy' | 'medium' | 'hard';
  onLevelChange: (level: 'easy' | 'medium' | 'hard') => void;
  onStartWorkout: () => void;
  stats: any;
}

export const HeroCallChallenge = ({
  currentWorkout,
  selectedLevel,
  onLevelChange,
  onStartWorkout,
  stats
}: HeroCallChallengeProps) => {
  const currentLevel = currentWorkout.levels.find(level => level.difficulty === selectedLevel);
  
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Shield className="h-4 w-4" />;
      case 'medium': return <Swords className="h-4 w-4" />;
      case 'hard': return <Flame className="h-4 w-4" />;
      default: return <Swords className="h-4 w-4" />;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'hard': return 'Hard';
      default: return 'Medium';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <Card className="max-w-2xl mx-auto bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-orange-400 tracking-wider">TODAY'S CHALLENGE</h1>
              <p className="text-slate-400">{currentWorkout.motivation}</p>
            </div>
            <div className="bg-slate-700 rounded-full px-3 py-1">
              <span className="text-orange-400 font-bold">{stats?.weeklyCount || 0}/7</span>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="grid grid-cols-3 gap-3">
            {currentWorkout.levels.map((level) => (
              <Button
                key={level.difficulty}
                variant={selectedLevel === level.difficulty ? "default" : "outline"}
                onClick={() => onLevelChange(level.difficulty)}
                className={`h-12 ${
                  selectedLevel === level.difficulty 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-500' 
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getDifficultyIcon(level.difficulty)}
                  {getDifficultyLabel(level.difficulty)}
                </div>
              </Button>
            ))}
          </div>

          {/* Workout Display */}
          <div className="bg-slate-900/50 rounded-lg p-6 space-y-4 border border-slate-700">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">{currentWorkout.name}</h2>
              <p className="text-slate-400">{currentWorkout.description}</p>
            </div>

            {/* The Ritual */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-300 tracking-wide">THE RITUAL:</h3>
              <div className="space-y-2">
                {currentLevel?.exercises.map((exercise, index) => {
                  const isMainExercise = exercise.startsWith('•');
                  const isHeader = exercise.includes('rounds') && index === 0;
                  
                  if (isHeader) {
                    return (
                      <div key={index} className="text-slate-300 font-semibold">
                        {exercise}
                      </div>
                    );
                  }
                  
                  if (isMainExercise) {
                    const exerciseNumber = currentLevel.exercises.slice(0, index).filter(ex => ex.startsWith('•')).length + 1;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                          {exerciseNumber}
                        </div>
                        <span className="text-slate-300 flex-1">
                          {exercise.replace(/^• /, '')}
                        </span>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={index} className="text-slate-300 pl-2">
                      {exercise}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center gap-2 text-orange-400 pt-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Estimated time: {currentLevel?.duration}</span>
            </div>
          </div>

          {/* Answer the Call Button */}
          {!stats?.completedToday && (
            <Button
              onClick={onStartWorkout}
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg tracking-wide"
              size="lg"
            >
              <span>ANSWER THE CALL</span>
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          )}

          {stats?.completedToday && (
            <div className="text-center p-4 bg-green-800/20 border border-green-700 rounded-lg">
              <p className="text-green-400 font-medium">Today's challenge has been conquered. Return tomorrow for your next trial.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};