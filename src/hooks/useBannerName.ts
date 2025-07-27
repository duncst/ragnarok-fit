import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBannerName = () => {
  const [bannerName, setBannerName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBannerNameModal, setShowBannerNameModal] = useState(false);

  useEffect(() => {
    const checkBannerName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('banner_name')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsLoading(false);
          return;
        }

        if (profile?.banner_name) {
          setBannerName(profile.banner_name);
        } else {
          setShowBannerNameModal(true);
        }
      } catch (error) {
        console.error('Error checking banner name:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBannerName();
  }, []);

  const completeBannerNameSetup = (name: string) => {
    setBannerName(name);
    setShowBannerNameModal(false);
  };

  return {
    bannerName,
    isLoading,
    showBannerNameModal,
    completeBannerNameSetup
  };
};