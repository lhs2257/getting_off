import { create } from 'zustand';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'settings' });

interface SettingsState {
  /** 보행 속도 (m/s) */
  walkingSpeed: number;
  /** 하차 전 알림 정거장 수 */
  alertStopsBefore: number;
  /** 알림 사운드 활성화 */
  soundEnabled: boolean;
  /** 진동 활성화 */
  vibrationEnabled: boolean;

  setWalkingSpeed: (speed: number) => void;
  setAlertStopsBefore: (count: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
}

function loadNumber(key: string, fallback: number): number {
  const val = storage.getNumber(key);
  return val !== undefined ? val : fallback;
}

function loadBoolean(key: string, fallback: boolean): boolean {
  const val = storage.getBoolean(key);
  return val !== undefined ? val : fallback;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  walkingSpeed: loadNumber('walkingSpeed', 1.2),
  alertStopsBefore: loadNumber('alertStopsBefore', 2),
  soundEnabled: loadBoolean('soundEnabled', true),
  vibrationEnabled: loadBoolean('vibrationEnabled', true),

  setWalkingSpeed: (speed) => {
    storage.set('walkingSpeed', speed);
    set({ walkingSpeed: speed });
  },
  setAlertStopsBefore: (count) => {
    storage.set('alertStopsBefore', count);
    set({ alertStopsBefore: count });
  },
  setSoundEnabled: (enabled) => {
    storage.set('soundEnabled', enabled);
    set({ soundEnabled: enabled });
  },
  setVibrationEnabled: (enabled) => {
    storage.set('vibrationEnabled', enabled);
    set({ vibrationEnabled: enabled });
  },
}));
