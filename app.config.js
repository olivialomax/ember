export default {
  expo: {
    name: "ember",
    slug: "ember",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/iOS.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.lomaxolivia.ember",
      infoPlist: {
        NSUserNotificationsUsageDescription: "Ember sends a gentle daily reminder to help you stay consistent with your check-ins.",
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.ember"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
      ["expo-notifications", {
        color: "#FAF7F2",
        iosDisplayInForeground: true
      }]
    ],
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      router: {},
      eas: {
        projectId: "9f13e618-9321-43f1-bc6a-64cebafa7089"
      }
    }
  }
}