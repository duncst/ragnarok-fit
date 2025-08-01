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
      <DialogContent className="max-w-lg p-8 bg-slate-900 border-slate-700 text-white">
        <DialogHeader className="space-y-4 text-center">
          <DialogTitle className="text-2xl font-bold text-white">
            Choose Your Name
          </DialogTitle>
          <p className="text-lg italic text-slate-300">
            "A man is not born with a name. He earns it."
          </p>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="text-center">
            <p className="text-lg font-medium text-white mb-6">
              What name will you carry into Valhalla?
            </p>
            
            <div className="space-y-4">
              <Input
                value={bannerName}
                onChange={(e) => setBannerName(e.target.value)}
                placeholder="Tretten"
                className="text-center text-lg py-3 bg-slate-800 border-orange-500 text-white placeholder:text-slate-400"
                maxLength={50}
              />
              
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !bannerName.trim()}
                className="w-full py-3 text-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                {isSubmitting ? 'Forging Your Name...' : 'Forge My Banner Name'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              This is not a username. This is your <span className="text-orange-400 font-semibold">Banner Name</span>—the name you'll carry into the Forge, the name your brothers will call in the storm, the name you'll etch into legend.
            </p>
            
            <p className="text-sm font-medium text-white">
              Make it strong. Make it true. Make it yours.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Examples:</h4>
            <div className="space-y-1">
              {exampleNames.map((name, index) => (
                <div key={index} className="text-slate-300 italic text-sm">
                  {name}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">This name will be:</h4>
            <ul className="space-y-1 text-slate-300 text-sm">
              <li>• Your identity within the Brotherhood</li>
              <li>• Engraved beneath your titles</li>
              <li>• What others will remember when your fire burns bright</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerNameModal;