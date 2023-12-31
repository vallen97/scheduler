import { ExpoConfig, ConfigContext } from "@expo/config";

const CLERK_PUBLISHABLE_KEY = "CLERK_PUBLISHABLE_KEY";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "Scheduler",
  slug: "scheduler-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#2e026d",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "your.bundle.identifier",
  },
  android: {
    package: "com.allenSoftware.scheduler",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#2e026d",
    },
  },
  extra: {
    eas: {
      projectId: "Your_ProjectID",
    },
    CLERK_PUBLISHABLE_KEY,
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
