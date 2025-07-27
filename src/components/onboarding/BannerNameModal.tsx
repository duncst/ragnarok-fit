import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BannerNameModalProps {
  open: boolean;
  onComplete: (bannerName: string) => void;
}

const BannerNameModal = ({ open, onComplete }: BannerNameModalProps) => {
  const [bannerName, setBannerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const exampleNames = [
    'Ironhowl',
    'Fenrir\'s Flame',
    'The Quiet Flame',
    'Storm-Kin',
    'Tyrborn'
  ];

  const handleSubmit = async () => {
    if (!bannerName.trim()) {
      toast({
        title: "Name Required",
        description: "You must choose a Banner Name to enter the Brotherhood.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ banner_name: bannerName.trim() })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      onComplete(bannerName.trim());
      toast({
        title: "Welcome to the Brotherhood",
        description: `Your Banner Name "${bannerName.trim()}" has been forged. Welcome, warrior.`
      });
    } catch (error) {
      console.error('Error saving banner name:', error);
      toast({
        title: "Error",
        description: "Failed to save your Banner Name. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl p-8 bg-card border-border">
        <DialogHeader className="space-y-6">
          <DialogTitle className="text-3xl font-bold text-center text-foreground">
            Choose Your Name
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg italic text-muted-foreground mb-4">
              "A man is not born with a name. He earns it."
            </p>
          </div>

          <div className="space-y-4 text-muted-foreground">
            <p>
              This is not a username. This is your <span className="text-primary font-semibold">Banner Name</span>—the name you'll carry into the Forge, the name your brothers will call in the storm, the name you'll etch into legend.
            </p>
            
            <p className="font-medium text-foreground">
              Make it strong. Make it true. Make it yours.
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">Examples:</h4>
            <div className="grid grid-cols-1 gap-2">
              {exampleNames.map((name, index) => (
                <div key={index} className="text-muted-foreground italic">
                  {name}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">This name will be:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Your identity within the Brotherhood</li>
                <li>• Engraved beneath your titles</li>
                <li>• What others will remember when your fire burns bright</li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-4">
                What name will you carry into Valhalla?
              </p>
              
              <div className="space-y-4">
                <Input
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  placeholder="Enter your Banner Name"
                  className="text-center text-lg py-3"
                  maxLength={50}
                />
                
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !bannerName.trim()}
                  className="w-full py-3 text-lg bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? 'Forging Your Name...' : 'Forge My Banner Name'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerNameModal;