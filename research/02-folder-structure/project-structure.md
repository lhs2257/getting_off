# 프로젝트 폴더 구조 리서치

## 권장 폴더 구조 (FSD 기반)

```
src/
  app/
    _layout.tsx               # 루트 레이아웃, 전역 프로바이더
    providers/
      NotificationProvider.tsx
      LocationProvider.tsx
      QueryProvider.tsx
    store/
      index.ts

  pages/
    home/                     # 홈 (출퇴근 시작 버튼)
    route-setup/              # 경로 저장/편집
    live-tracking/            # 실시간 교통 위치 확인
    settings/                 # 앱 설정

  widgets/
    route-card/               # 경로 요약 카드
    live-map/                 # 실시간 지도 위젯
    transit-timeline/         # 경로 타임라인 (정거장 목록)
    notification-panel/       # 알림 히스토리

  features/
    commute-session/          # 출퇴근 세션 시작/종료
    route-save/               # 경로 저장 기능
    stop-alert/               # 정거장 도착 알림
    transfer-guide/           # 환승 안내 (도보 시간 포함)
    realtime-position/        # 실시간 교통편 위치

  entities/
    route/
      model/                  # Route 타입, 스토어 슬라이스
      api/                    # 경로 API 호출
      ui/                     # 경로 관련 공통 UI
    stop/
    transit/
    user/

  shared/
    api/
      client.ts               # Axios/fetch 기본 클라이언트
      gtfs.ts                 # GTFS Realtime API 클라이언트
    ui/
      Button/, Card/, Modal/
    hooks/
      useLocation.ts
      useNetworkStatus.ts
    lib/
      notifications.ts
      geofence.ts
      storage.ts
    constants/
      routes.ts
      alerts.ts

  services/
    background/
      locationTask.ts         # expo-task-manager 백그라운드 태스크
      foregroundService.ts    # Android 포그라운드 서비스
    cache/
      gtfsCache.ts
      routeCache.ts
    notification/
      scheduler.ts
      dispatcher.ts
```

## Zustand 스토어 분리

```
store/
  useLocationStore.ts       # 현재 위치, 이동 경로 추적
  useCommuteStore.ts        # 출퇴근 세션 (시작/종료/단계)
  useRouteStore.ts          # 저장된 경로 목록
  useAlertStore.ts          # 알림 큐, 알림 이력
  useSettingsStore.ts       # 사용자 설정값
```

## 출처

- [React Native Folder Structure 2025 - CoderCrafter](https://codercrafter.in/blogs/react-native/react-native-folder-structure-2025-a-no-bs-guide-to-scalable-apps)
- [Mobile App Architecture: React Native Guide 2026 - Applighter](https://www.applighter.com/blog/mobile-app-architecture)
