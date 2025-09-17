import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jirehfaith.app",
  appName: "JirehFaith",
  webDir: "out",
  android: {
  // Allows modern https content and eases debugging while we stabilize layout
  allowMixedContent: true,
  webContentsDebuggingEnabled: true,
  // Keep background consistent with theme (optional but nice for splash → first paint)
  backgroundColor: "#000000"
},
  server: {
    androidScheme: "https"
  }
};

export default config;
