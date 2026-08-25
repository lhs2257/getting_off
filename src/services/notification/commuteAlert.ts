import * as Notifications from 'expo-notifications';

/**
 * 알림 초기 설정 (앱 시작 시 1회 호출)
 */
export async function setupNotifications(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  return true;
}

/**
 * 정거장 접근 알림
 */
export async function notifyApproaching(
  stationName: string,
  remainingStops: number,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '정거장 접근 중',
      body: `${stationName} 부근입니다. ${remainingStops}정거장 남았습니다.`,
      sound: true,
      categoryIdentifier: 'commute',
    },
    trigger: null,
  });
}

/**
 * 정거장 도착 알림
 */
export async function notifyArrived(stationName: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '정거장 도착',
      body: `${stationName}에 도착했습니다.`,
      sound: true,
      categoryIdentifier: 'commute',
    },
    trigger: null,
  });
}

/**
 * 하차역 도착 알림 (강조)
 */
export async function notifyExitStop(stationName: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '하차역 도착!',
      body: `${stationName}에서 내리세요!`,
      sound: true,
      categoryIdentifier: 'commute',
    },
    trigger: null,
  });
}

/**
 * 환승 안내 알림
 */
export async function notifyTransfer(
  fromName: string,
  nextLaneName: string,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '환승 안내',
      body: `${fromName}에서 하차 후 ${nextLaneName}(으)로 환승하세요.`,
      sound: true,
      categoryIdentifier: 'commute',
    },
    trigger: null,
  });
}
