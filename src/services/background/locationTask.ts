import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const LOCATION_TASK_NAME = 'background-location-task';

/**
 * 위치 업데이트 콜백 등록용 리스너
 * CommuteScreen 등에서 구독하여 위치 변화를 처리합니다.
 */
type LocationListener = (locations: Location.LocationObject[]) => void;

let listener: LocationListener | null = null;

export function setLocationListener(fn: LocationListener | null) {
  listener = fn;
}

/**
 * 백그라운드 위치 추적 태스크 정의
 * 앱이 백그라운드에 있어도 위치 업데이트를 수신합니다.
 */
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    if (__DEV__) console.warn('[LocationTask] error:', error.message);
    return;
  }

  const { locations } = data as { locations: Location.LocationObject[] };
  if (locations && listener) {
    listener(locations);
  }
});

/**
 * 백그라운드 위치 추적 시작
 */
export async function startLocationTracking(): Promise<boolean> {
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== 'granted') return false;

  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== 'granted') return false;

  const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isStarted) return true;

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000,
    distanceInterval: 20,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'Getting Off',
      notificationBody: '출퇴근 위치를 추적 중입니다',
      notificationColor: '#1A73E8',
    },
  });

  return true;
}

/**
 * 백그라운드 위치 추적 중지
 */
export async function stopLocationTracking(): Promise<void> {
  const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
  listener = null;
}
