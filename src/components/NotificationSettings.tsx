import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettings = ({ isOpen, onClose }: NotificationSettingsProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check current notification permission
    setNotificationPermission(Notification.permission);
    
    // Check if user has previously enabled notifications
    const enabled = localStorage.getItem('heroCallNotifications') === 'true';
    setNotificationsEnabled(enabled);
  }, [isOpen]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    }
    return false;
  };

  const scheduleNotification = () => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      // Schedule daily notification at 9 AM
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(9, 0, 0, 0);
      
      // If it's already past 9 AM today, schedule for tomorrow
      if (now > scheduledTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification("Hero's Call Reminder", {
            body: "A warrior's discipline is forged through consistent action. Let the horn of Heimdall remind you of your daily quest.",
            icon: "/lovable-uploads/6ace109c-b935-4cbe-ae24-b2adfe21bde8.png",
            badge: "/lovable-uploads/6ace109c-b935-4cbe-ae24-b2adfe21bde8.png",
            tag: "hero-call-reminder",
            requireInteraction: true,
          });
        }
        
        // Schedule the next day's notification
        setInterval(() => {
          if (Notification.permission === 'granted' && localStorage.getItem('heroCallNotifications') === 'true') {
            new Notification("Hero's Call Reminder", {
              body: "A warrior's discipline is forged through consistent action. Let the horn of Heimdall remind you of your daily quest.",
              icon: "/lovable-uploads/6ace109c-b935-4cbe-ae24-b2adfe21bde8.png",
              badge: "/lovable-uploads/6ace109c-b935-4cbe-ae24-b2adfe21bde8.png",
              tag: "hero-call-reminder",
              requireInteraction: true,
            });
          }
        }, 24 * 60 * 60 * 1000); // 24 hours
      }, timeUntilNotification);
    }
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        setNotificationsEnabled(true);
        localStorage.setItem('heroCallNotifications', 'true');
        scheduleNotification();
        sonnerToast.success("Daily reminders enabled");
      } else {
        sonnerToast.error("Notification permission denied");
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('heroCallNotifications', 'false');
      sonnerToast.success("Daily reminders disabled");
    }
  };

  const handleSaveSettings = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Bell className="h-6 w-6 text-primary" />
            Hero's Call Reminders
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Set up daily notifications to remind you to answer the Hero's Call and begin your training ritual.
          </p>
          
          <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
            <p className="italic text-sm text-center">
              "A warrior's discipline is forged through consistent action. Let the horn of Heimdall remind you of your daily quest."
            </p>
          </div>
          
          {notificationPermission === 'denied' && (
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5 flex items-start gap-3">
              <BellOff className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Notifications Blocked</h4>
                <p className="text-sm text-muted-foreground">
                  Browser notifications are blocked. Please enable them in your browser settings to receive Hero's Call reminders.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Daily Reminders</h4>
                <p className="text-sm text-muted-foreground">
                  Receive a daily Hero's Call notification
                </p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
              disabled={notificationPermission === 'denied'}
            />
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};