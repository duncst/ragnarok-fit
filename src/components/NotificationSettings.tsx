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
import { Bell, BellOff, Clock } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { Label } from '@/components/ui/label';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettings = ({ isOpen, onClose }: NotificationSettingsProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [notificationTime, setNotificationTime] = useState('09:00');

  useEffect(() => {
    // Check current notification permission
    setNotificationPermission(Notification.permission);
    
    // Check if user has previously enabled notifications
    const enabled = localStorage.getItem('heroCallNotifications') === 'true';
    setNotificationsEnabled(enabled);
    
    // Load saved notification time
    const savedTime = localStorage.getItem('heroCallNotificationTime') || '09:00';
    setNotificationTime(savedTime);
  }, [isOpen]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    }
    return false;
  };

  const getRandomNotificationText = () => {
    const notifications = [
      {
        title: "🛡️ The horn sounds.",
        body: "Rise, warrior. The Hero's Call awaits."
      },
      {
        title: "🔥 Ritual. Not motivation.",
        body: "Open the Forge. Shape your soul."
      },
      {
        title: "⚔️ Today, you train for the man you must become.",
        body: "Begin the Call."
      },
      {
        title: "⛓ Discipline is your weapon. The Call is your grindstone.",
        body: "Sharpen yourself."
      },
      {
        title: "🌄 Effort. Not perfection. Just one act of courage.",
        body: "Answer the Call."
      }
    ];
    
    return notifications[Math.floor(Math.random() * notifications.length)];
  };

  const scheduleNotification = () => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      // Parse the selected time
      const [hours, minutes] = notificationTime.split(':').map(Number);
      
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // If it's already past the scheduled time today, schedule for tomorrow
      if (now > scheduledTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      setTimeout(() => {
        if (Notification.permission === 'granted') {
          const randomText = getRandomNotificationText();
          new Notification(randomText.title, {
            body: randomText.body,
            icon: "/lovable-uploads/6ace109c-b935-4cbe-ae24-b2adfe21bde8.png",
            badge: "/lovable-uploads/6ace109c-b935-4cbe-ae24-b2adfe21bde8.png",
            tag: "hero-call-reminder",
            requireInteraction: true,
          });
        }
        
        // Schedule the next day's notification
        setInterval(() => {
          if (Notification.permission === 'granted' && localStorage.getItem('heroCallNotifications') === 'true') {
            const randomText = getRandomNotificationText();
            new Notification(randomText.title, {
              body: randomText.body,
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

  const handleTimeChange = (time: string) => {
    setNotificationTime(time);
    localStorage.setItem('heroCallNotificationTime', time);
    
    // If notifications are already enabled, reschedule with new time
    if (notificationsEnabled) {
      scheduleNotification();
      sonnerToast.success(`Reminder time updated to ${time}`);
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
          
          {notificationsEnabled && (
            <div className="p-4 border rounded-lg bg-card space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Reminder Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose when you want to receive your daily reminder
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="notification-time" className="text-sm font-medium">
                  Time:
                </Label>
                <input
                  id="notification-time"
                  type="time"
                  value={notificationTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          )}
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