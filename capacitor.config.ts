import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.798d136741b5441082ca4859baa70d1c',
  appName: 'ragnarok-fit',
  webDir: 'dist',
  server: {
    url: "https://798d1367-41b5-4410-82ca-4859baa70d1c.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    }
  }
};

export default config;