import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Play, Clock, X, RotateCcw, Trash2 } from 'lucide-react';
import { CreateRitualModal } from './CreateRitualModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast as sonnerToast } from 'sonner';
import { ValhallaSection } from '../workout/ValhallaSection';

interface Ritual {
  id: string;
  name: string;
  description?: string;
  category: 'Strength' | 'Endurance' | 'Mobility' | 'All';
  exercises: Array<{
    name: string;
    sets: number;
    reps?: number;
    duration?: string;
    distance?: string;
  }>;
  lastPerformed?: string;
}

export const RitualsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Valhalla');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['workout-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workout_templates')
        .select(`
          *,
          workout_template_exercises (
            exercise_name,
            sets,
            order
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const rituals: Ritual[] = templates.map(template => ({
    id: template.id,
    name: template.name,
    description: `Custom training ritual`,
    category: 'Strength', // Default for now, could be enhanced
    exercises: template.workout_template_exercises?.map(ex => ({
      name: ex.exercise_name,
      sets: ex.sets,
      reps: 10 // Default, could be enhanced
    })) || [],
    lastPerformed: template.created_at
  }));

  const filteredRituals = activeTab === 'Valhalla' 
    ? [] 
    : rituals.filter(ritual => ritual.category === activeTab);

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase.from('workout_templates').delete().eq('id', templateId);
      if (error) throw error;
    },
    onSuccess: () => {
      sonnerToast.success('Ritual deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
    },
    onError: (error) => {
      sonnerToast.error('Failed to delete ritual.', { description: (error as Error).message });
    },
  });

  const handleBeginRitual = (ritual: Ritual) => {
    // Navigate to ritual workout execution page
    navigate(`/ritual/${ritual.id}/workout`, { 
      state: { 
        templateName: ritual.name 
      } 
    });
  };

  const handleDeleteRitual = (ritualId: string) => {
    deleteTemplateMutation.mutate(ritualId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center space-y-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">Your Rituals</h1>
        <p className="text-lg text-muted-foreground">
          Create and track your personal training rituals to forge your own path.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-muted/30">
          <TabsTrigger value="Valhalla" className="flex-1">Valhalla</TabsTrigger>
          <TabsTrigger value="Strength" className="flex-1">Strength</TabsTrigger>
          <TabsTrigger value="Endurance" className="flex-1">Endurance</TabsTrigger>
          <TabsTrigger value="Mobility" className="flex-1">Mobility</TabsTrigger>
        </TabsList>

        {/* Valhalla Tab Content */}
        <TabsContent value="Valhalla" className="space-y-4">
          <ValhallaSection />
        </TabsContent>

        {/* Other Tabs Content */}
        <TabsContent value={activeTab} className="space-y-4">
          {activeTab !== 'Valhalla' && (
            <>
              {/* Create New Ritual Button */}
              <Button 
                onClick={() => {
                  if (activeTab === 'Endurance') {
                    navigate('/log-run');
                  } else {
                    setShowCreateModal(true);
                  }
                }}
                className="w-full h-14 text-lg bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                {activeTab === 'Endurance' ? 'Log a Run' : 'Create New Ritual'}
              </Button>

              {/* Rituals List */}
              <div className="space-y-4">
                {filteredRituals.length === 0 ? (
                  <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="text-muted-foreground">
                        <p className="text-lg">No rituals found</p>
                        <p>Create your first ritual to begin your journey</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredRituals.map((ritual) => (
                    <Card key={ritual.id} className="border-border/50 bg-card/50 backdrop-blur">
                      <CardContent className="p-6 space-y-4">
                        {/* Ritual Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-primary">{ritual.name}</h3>
                            <p className="text-muted-foreground">{ritual.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {ritual.category}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this ritual? This action cannot be undone.')) {
                                  handleDeleteRitual(ritual.id);
                                }
                              }}
                              disabled={deleteTemplateMutation.isPending}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Exercises */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Exercises</h4>
                          <div className="space-y-2">
                            {ritual.exercises.map((exercise, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
                                <span className="text-foreground">{exercise.name}</span>
                                <span className="text-primary font-medium">
                                  {exercise.sets} x {exercise.reps || exercise.duration || exercise.distance}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              Last performed: {ritual.lastPerformed 
                                ? formatDistanceToNow(new Date(ritual.lastPerformed), { addSuffix: true })
                                : 'Never'
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button 
                              onClick={() => handleBeginRitual(ritual)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Begin Ritual
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Ritual Modal */}
      <CreateRitualModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};