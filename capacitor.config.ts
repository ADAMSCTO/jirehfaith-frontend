import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jirehfaith.app',
  appName: 'jirehfaith-frontend',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // instant handoff (no delay)
      backgroundColor: "#6C3BAA", // royal purple, hex format
      androidScaleType: "CENTER_INSIDE",
      showSpinner: false,
      splashImmersive: true,
    },
  },
};

export default config;
