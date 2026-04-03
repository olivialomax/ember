import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, typography } from '../tokens';
import { LoginScreen } from '../features/auth/LoginScreen';
import { SignupScreen } from '../features/auth/SignupScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { CheckInScreen, CheckInSummaryScreen } from '../features/checkin';
import { SettingsScreen } from '../features/settings';
import { JournalScreen } from '../features/journal';
import { GratitudeModal } from '../features/gratitude';

export type CheckInStackParamList = {
  CheckInForm: undefined;
  CheckInSummary: undefined;
};

// ─── Placeholder screens ────────────────────────────────────────────────────

const placeholder = (name: string) =>
  function PlaceholderScreen() {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>{name}</Text>
      </View>
    );
  };
// JournalScreen is imported above
const InsightsScreen = placeholder('Insights');
const StreaksScreen = placeholder('Streaks');
// SettingsScreen is imported above

// ─── Tab icons (text-based until icon library is added) ─────────────────────

type TabIconProps = { focused: boolean; label: string };

function TabIcon({ focused, label }: TabIconProps) {
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
      {label}
    </Text>
  );
}

// ─── Navigators ──────────────────────────────────────────────────────────────

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const CheckInModalStack = createNativeStackNavigator<CheckInStackParamList>();

function CheckInStackNavigator() {
  return (
    <CheckInModalStack.Navigator screenOptions={{ headerShown: false }}>
      <CheckInModalStack.Screen name="CheckInForm" component={CheckInScreen} />
      <CheckInModalStack.Screen name="CheckInSummary" component={CheckInSummaryScreen} />
    </CheckInModalStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.sage,
        tabBarInactiveTintColor: colors.stone,
        tabBarLabelStyle: styles.tabLabel,
        tabBarLabel: route.name,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            label={tabIcons[route.name as keyof typeof tabIcons] ?? '·'}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Streaks" component={StreaksScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
        <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
          <RootStack.Screen name="CheckIn" component={CheckInStackNavigator} />
          <RootStack.Screen name="Gratitude" component={GratitudeModal} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

// ─── Tab icon map ─────────────────────────────────────────────────────────────

const tabIcons = {
  Home: '⌂',
  Journal: '✎',
  Insights: '◈',
  Streaks: '◉',
  Settings: '⚙',
} as const;

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: `${colors.cream}E6`, // ~90% opacity
    borderTopWidth: 0,
    paddingTop: 12,
    paddingBottom: 24,
    height: 76,
  },
  tabLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.08 * 9,
  },
  tabIcon: {
    fontSize: 18,
    color: colors.stone,
    opacity: 0.4,
  },
  tabIconActive: {
    color: colors.sage,
    opacity: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  placeholderText: {
    fontFamily: typography.display,
    fontSize: 24,
    color: colors.stone,
  },
});
