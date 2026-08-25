import { useEffect, useRef, useState } from 'react';
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
 * active가 true이면 추적을 시작하고, false이면 중지합니다.
 * 포그라운드에서는 watchPositionAsync, 백그라운드에서는 TaskManager를 사용합니다.
 */
export function useLocationTracking(active: boolean) {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    if (!active) {
      cleanup();
      return;
    }

    let mounted = true;

    async function start() {
      // 포그라운드 위치 감시
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (mounted) setError('위치 권한이 필요합니다');
        return;
      }

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        (loc) => {
          if (!mounted) return;
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy,
            timestamp: loc.timestamp,
          });
        },
      );

      // 백그라운드 추적도 시작
      const bgStarted = await startLocationTracking();
      if (!bgStarted && mounted) {
        setError('백그라운드 위치 권한이 필요합니다');
      }

      // 백그라운드 리스너 등록
      setLocationListener((locations) => {
        if (!mounted || locations.length === 0) return;
        const latest = locations[locations.length - 1];
        setLocation({
          latitude: latest.coords.latitude,
          longitude: latest.coords.longitude,
          accuracy: latest.coords.accuracy,
          timestamp: latest.timestamp,
        });
      });
    }

    start();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [active]);

  function cleanup() {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
    stopLocationTracking();
    setLocationListener(null);
  }

  return { location, error };
}
