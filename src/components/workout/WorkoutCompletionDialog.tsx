import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface WorkoutCompletionDialogProps {
  isOpen: boolean;
  workoutName: string;
  workoutDuration: string;
  onComplete: (data: { message?: string; saveAsTemplate?: boolean; templateName?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const WorkoutCompletionDialog = ({
  isOpen,
  workoutName,
  workoutDuration,
  onComplete,
  onCancel,
  isLoading = false
}: WorkoutCompletionDialogProps) => {
  const [message, setMessage] = useState('');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleComplete = () => {
    onComplete({
      message: message.trim() || undefined,
      saveAsTemplate,
      templateName: saveAsTemplate ? templateName.trim() : undefined
    });
  };

  const handleSkip = () => {
    onComplete({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-primary">
            The Ritual is Complete
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-sm">
              {workoutName}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Duration: {workoutDuration}
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="forge-message" className="text-base font-medium text-foreground">
              Etch your mark in the forge. What did today demand of you?
            </Label>
            <Textarea
              id="forge-message"
              placeholder="Your reflection on today's trial..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={280}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/280
            </p>
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-template"
                checked={saveAsTemplate}
                onCheckedChange={(checked) => setSaveAsTemplate(checked === true)}
              />
              <Label
                htmlFor="save-template"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Save as template for future workouts
              </Label>
            </div>
            
            {saveAsTemplate && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="template-name" className="text-sm">
                  Template Name
                </Label>
                <Input
                  id="template-name"
                  placeholder="Enter template name..."
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="h-10"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={isLoading}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Forging...' : 'Complete Ritual'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};