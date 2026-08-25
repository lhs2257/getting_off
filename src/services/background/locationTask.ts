import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { AppState } from 'react-native';

export const LOCATION_TASK_NAME = 'background-location-task';

/**
 * 위치 업데이트 콜백 등록용 리스너
 */
type LocationListener = (locations: Location.LocationObject[]) => void;

let listener: LocationListener | null = null;

export function setLocationListener(fn: LocationListener | null) {
  listener = fn;
}

/**
 * 백그라운드 위치 추적 태스크 정의
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
 *
 * 배터리 최적화:
 * - 백그라운드: Balanced 정확도, 10초/50m 간격
 * - 포그라운드: High 정확도는 useLocationTracking에서 별도 처리
 * - deferredUpdatesInterval로 배치 업데이트
 * - pausesUpdatesAutomatically로 정지 시 자동 일시정지 (iOS)
 */
export async function startLocationTracking(): Promise<boolean> {
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== 'granted') return false;

  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== 'granted') return false;

  const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isStarted) return true;

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 10_000,
    distanceInterval: 50,
    deferredUpdatesInterval: 10_000,
    showsBackgroundLocationIndicator: true,
    pausesUpdatesAutomatically: true,
    activityType: Location.ActivityType.OtherNavigation,
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
  try {
    const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (isStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  } catch {
    // 이미 중지된 경우 무시
  }
  listener = null;
}

/**
 * 현재 앱이 포그라운드인지 확인
 */
export function isAppInForeground(): boolean {
  return AppState.currentState === 'active';
}
