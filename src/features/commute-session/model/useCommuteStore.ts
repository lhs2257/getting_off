import { create } from 'zustand';
import type { SavedRoute } from '../../../entities/route/model/SavedRoute';
import type { OdsaySubPath } from '../../../entities/route/model/types';

type SessionStatus = 'idle' | 'active' | 'paused';

interface CommuteState {
  status: SessionStatus;
  route: SavedRoute | null;
  currentSubPathIndex: number;
  currentStopIndex: number;
  startedAt: string | null;

  startSession: (route: SavedRoute) => void;
  stopSession: () => void;
  advanceSubPath: () => void;
  setCurrentStopIndex: (index: number) => void;
  getCurrentSubPath: () => OdsaySubPath | null;
  getRemainingStops: () => number;
}

export const useCommuteStore = create<CommuteState>((set, get) => ({
  status: 'idle',
  route: null,
  currentSubPathIndex: 0,
  currentStopIndex: 0,
  startedAt: null,

  startSession: (route) =>
    set({
      status: 'active',
      route,
      currentSubPathIndex: 0,
      currentStopIndex: 0,
      startedAt: new Date().toISOString(),
    }),

  stopSession: () =>
    set({
      status: 'idle',
      route: null,
      currentSubPathIndex: 0,
      currentStopIndex: 0,
      startedAt: null,
    }),

  advanceSubPath: () => {
    const { currentSubPathIndex } = get();
    set({ currentSubPathIndex: currentSubPathIndex + 1, currentStopIndex: 0 });
  },

  setCurrentStopIndex: (index) => set({ currentStopIndex: index }),

  getCurrentSubPath: () => {
    const { route, currentSubPathIndex } = get();
    if (!route) return null;
    return route.path.subPath[currentSubPathIndex] ?? null;
  },

  getRemainingStops: () => {
    const { route, currentSubPathIndex, currentStopIndex } = get();
    if (!route) return 0;

    const subPath = route.path.subPath[currentSubPathIndex];
    if (!subPath || subPath.trafficType === 3) return 0;

    return Math.max(0, subPath.stationCount - currentStopIndex);
  },
}));
