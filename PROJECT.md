# Getting Off - 직장인 출퇴근 교통 알림 앱

## 프로젝트 개요

직장인을 위한 출퇴근 교통 알림 앱입니다. 지하철과 버스를 모두 지원하며, 출퇴근 경로를 저장해두고 "출퇴근 시작" 버튼 하나로 정거장 알림, 하차 알림, 환승 안내를 자동으로 받을 수 있습니다.

### 벤치마킹

- [이번정류장](https://thisstop.co.kr/) - 지하철 정거장 알림 앱
- 차별점: 지하철 + 버스 통합 지원, 출퇴근 경로 저장, 환승 도보 시간 고려

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React Native + Expo SDK 53 |
| 언어 | TypeScript |
| 상태 관리 | Zustand + React Query |
| 로컬 DB | expo-sqlite |
| 빠른 스토리지 | react-native-mmkv |
| 위치 추적 | expo-location + expo-task-manager |
| 알림 | expo-notifications |
| 지도 | react-native-maps |
| 네트워킹 | Axios + React Query |

## API 연동

| 역할 | API |
|------|-----|
| 서울 버스/지하철 실시간 | 서울열린데이터광장 |
| 경기 버스 실시간 | GBIS API |
| 경로 탐색/환승 | ODsay API |
| 전국 확장 시 | TAGO API |

## 아키텍처

FSD(Feature-Sliced Design) + Clean Architecture 혼합

```
src/
  app/          앱 진입점, 프로바이더, 라우팅
  pages/        화면 단위 (home, route-setup, live-tracking, settings)
  widgets/      독립 UI 블록 (route-card, live-map, transit-timeline)
  features/     비즈니스 기능 (commute-session, route-save, stop-alert, transfer-guide, realtime-position)
  entities/     도메인 모델 (route, stop, transit, user)
  shared/       공통 유틸, API, UI, 훅
  services/     백그라운드 서비스 (background, cache, notification)
```

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `RouteCard.tsx` |
| 훅 | camelCase + use | `useCommuteSession.ts` |
| 폴더 | kebab-case | `commute-session/` |
| 상수 | UPPER_SNAKE_CASE | `MAX_GEOFENCE_COUNT` |

### 도메인 용어

| 한국어 | 코드명 |
|--------|--------|
| 출퇴근 세션 | commuteSession |
| 경로 | route |
| 정거장/정류장 | stop |
| 하차역 | exitStop |
| 환승 | transfer |
| 교통편 | transit |
| 알림 | alert |

## 커밋 메시지 규칙

`<타입>(<범위>): <요약>` 형식 사용 (한국어)

| 타입 | 의미 |
|------|------|
| 기능 | 새로운 기능 추가 |
| 수정 | 버그 수정 |
| 문서 | 문서 변경 |
| 구조 | 리팩토링 |
| 설정 | 설정/환경 변경 |
| 초기화 | 프로젝트 초기 세팅 |
