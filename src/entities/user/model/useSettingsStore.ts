import { create } from 'zustand';

// TODO: 네이티브 빌드 시 react-native-mmkv로 교체하여 영속화
// Expo Go 호환을 위해 인메모리 스토어 사용 (앱 재시작 시 초기화됨)

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

export const useSettingsStore = create<SettingsState>((set) => ({
  walkingSpeed: 1.2,
  alertStopsBefore: 2,
  soundEnabled: true,
  vibrationEnabled: true,

  setWalkingSpeed: (speed) => set({ walkingSpeed: speed }),
  setAlertStopsBefore: (count) => set({ alertStopsBefore: count }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setVibrationEnabled: (enabled) => set({ vibrationEnabled: enabled }),
}));
