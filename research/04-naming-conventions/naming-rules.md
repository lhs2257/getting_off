# 네이밍 컨벤션 리서치

## 파일 및 폴더

| 대상 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 파일 | PascalCase | `RouteCard.tsx`, `StopAlertModal.tsx` |
| 훅 파일 | camelCase + `use` 접두사 | `useLocation.ts`, `useCommuteSession.ts` |
| 유틸 함수 파일 | camelCase | `calculateDistance.ts`, `formatTime.ts` |
| 스토어 파일 | camelCase + `use` 접두사 | `useLocationStore.ts`, `useRouteStore.ts` |
| 서비스 파일 | camelCase | `locationTask.ts`, `gtfsCache.ts` |
| 폴더명 | kebab-case | `commute-session/`, `route-setup/` |
| 타입 파일 | camelCase | `route.types.ts`, `transit.types.ts` |
| 상수 파일 | camelCase | `alertMessages.ts`, `routeConstants.ts` |
| 테스트 파일 | 원본 + `.test` | `useLocation.test.ts`, `RouteCard.test.tsx` |

## 컴포넌트 및 변수

| 대상 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase | `CommuteStartButton` |
| 훅 | camelCase + use | `useGeofence` |
| 상수 (전역) | UPPER_SNAKE_CASE | `MAX_GEOFENCE_COUNT` |
| 타입/인터페이스 | PascalCase + 접미사 | `RouteEntity`, `TransitApiResponse` |
| Zustand 액션 | camelCase 동사 | `startSession`, `updateLocation` |
| API 함수 | camelCase 동사 | `fetchRouteById` |

## 도메인 용어 통일 (한/영 대응표)

| 한국어 | 영어 코드명 | 비고 |
|--------|-----------|------|
| 출퇴근 세션 | commuteSession | 시작/종료 단위 |
| 경로 | route | 저장된 출퇴근 경로 |
| 정거장/정류장 | stop | 지하철역, 버스정류장 통합 |
| 하차역 | exitStop | 내려야 하는 정거장 |
| 환승 | transfer | 교통편 전환 지점 |
| 교통편 | transit | 지하철 또는 버스 |
| 알림 | alert | 정거장 도착 등의 알림 |
| 실시간 위치 | realtimePosition | 차량 실시간 위치 |

## 출처

- [React Native Naming Conventions - Medium](https://medium.com/@imranrafeek/best-practices-for-naming-conventions-in-react-native-21f16df6179e)
