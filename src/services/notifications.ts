import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const NOTIFICATION_ID_KEY = 'ember-daily-reminder';

// expo-notifications native modules are not available in Expo Go
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export async function requestPermission(): Promise<boolean> {
  if (isExpoGo) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Daily reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: null,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDaily(hour: number, minute: number): Promise<void> {
  if (isExpoGo) return;

  // Set handler lazily so it only runs in native builds
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  await cancelReminder();

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID_KEY,
    content: {
      title: 'Ember',
      body: 'Time for your daily check-in ✨',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelReminder(): Promise<void> {
  if (isExpoGo) return;
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID_KEY);
}
