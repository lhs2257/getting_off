import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';
import {
  startLocationTracking,
  stopLocationTracking,
  setLocationListener,
} from '../../services/background/locationTask';

export interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
}

/**
 * 위치 추적 훅
 *
 * - 포그라운드: watchPositionAsync (High 정확도, 3초/10m)
 * - 백그라운드: TaskManager (Balanced 정확도, 10초/50m)
 * - 앱 상태 변화 시 포그라운드 감시 자동 시작/중지 (배터리 절약)
 */
export function useLocationTracking(active: boolean) {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!active) {
      cleanup();
      return;
    }

    startTracking();

    // 앱 상태 변화 감지: 포그라운드 복귀 시 정밀 추적 재시작
    const subscription = AppState.addEventListener('change', (state) => {
      if (!mountedRef.current || !active) return;

      if (state === 'active') {
        startForegroundWatch();
      } else {
        stopForegroundWatch();
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.remove();
      cleanup();
    };
  }, [active]);

  async function startTracking() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      if (mountedRef.current) setError('위치 권한이 필요합니다');
      return;
    }

    await startForegroundWatch();

    const bgStarted = await startLocationTracking();
    if (!bgStarted && mountedRef.current) {
      setError('백그라운드 위치 권한이 필요합니다');
    }

    setLocationListener((locations) => {
      if (!mountedRef.current || locations.length === 0) return;
      const latest = locations[locations.length - 1];
      updateLocation(latest);
    });
  }

  async function startForegroundWatch() {
    stopForegroundWatch();

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 10,
      },
      (loc) => {
        if (!mountedRef.current) return;
        updateLocation(loc);
      },
    );
  }

  function stopForegroundWatch() {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
  }

  function updateLocation(loc: Location.LocationObject) {
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy,
      timestamp: loc.timestamp,
    });
  }

  function cleanup() {
    stopForegroundWatch();
    stopLocationTracking();
    setLocationListener(null);
  }

  return { location, error };
}
