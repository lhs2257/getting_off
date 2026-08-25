# 모듈화 방법론 및 아키텍처 리서치

## 방법론 비교

| 방법론 | 특징 | 적합 규모 | 출퇴근 앱 적합도 |
|--------|------|-----------|----------------|
| Feature-Sliced Design (FSD) | 계층 기반, 도메인 중심 분리 | 중-대형 | 높음 |
| Feature-based Modularization | 기능별 독립 폴더 | 소-중형 | 높음 |
| Clean Architecture | UI/Domain/Data 3계층 분리 | 중-대형 | 중간 |
| Atomic Design | UI 컴포넌트 중심 | UI 집중 앱 | 낮음 |

## 권장: FSD + Clean Architecture 혼합

출퇴근 알림 앱은 도메인이 명확(경로, 위치, 알림, 교통편)하고 백그라운드 서비스와 UI가 명확히 분리되어야 합니다. FSD의 레이어 구조에 Clean Architecture의 데이터 계층을 결합하는 것이 최적입니다.

### FSD 7개 레이어 (위에서 아래로만 참조 가능)

```
app       -> 앱 진입점, 라우팅, 글로벌 프로바이더
pages     -> 홈, 경로설정, 실시간추적, 설정 화면
widgets   -> 경로카드, 실시간지도, 알림패널 (독립 UI 블록)
features  -> 출퇴근시작, 경로저장, 하차알림, 환승안내
entities  -> 경로(Route), 정거장(Stop), 교통편(Transit), 사용자(User)
shared    -> UI 공통 컴포넌트, 유틸, API 클라이언트, 훅
```

## 상태 관리 전략: Zustand + React Query

| 상태 종류 | 관리 도구 | 이유 |
|----------|----------|------|
| 위치 데이터 (실시간) | Zustand | 고빈도 업데이트, 최소 리렌더 |
| 경로 데이터 (서버) | React Query | 캐싱, 백그라운드 갱신 |
| 알림 상태 | Zustand | UI 연동 즉각 반응 |
| 출퇴근 세션 상태 | Zustand + MMKV 영속화 | 앱 재시작 후 복원 필요 |
| 사용자 설정 | Zustand + MMKV | 오프라인에서도 유지 |

## 오프라인 지원: 2계층 캐싱

- 레이어 1 (SQLite/WatermelonDB): GTFS 정적 데이터 (노선, 정거장, 시간표)
- 레이어 2 (MMKV): 사용자 설정, 저장된 경로, 현재 세션 상태

## 백그라운드 서비스 흐름

```
[출퇴근 시작] -> [지오펜스 등록] -> [위치 업데이트 수신]
    -> [정거장 도착 감지] -> [알림 발송] -> [출퇴근 종료]
```

### 배터리 최적화

- 비활성 상태 시 위치 추적 완전 중단
- 이동 속도에 따라 GPS 폴링 간격 동적 조정
- 지오펜스 기반 알림 우선 (GPS 지속 폴링보다 효율적)

## 출처

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/docs/get-started/overview)
- [React Native Folder Structure 2025 - CoderCrafter](https://codercrafter.in/blogs/react-native/react-native-folder-structure-2025-a-no-bs-guide-to-scalable-apps)
- [React Native Background Tasks in 2026: iOS vs Android](https://www.72technologies.com/blog/react-native-background-tasks-ios-android-2026)
- [React Native State 2026: Zustand vs Redux Toolkit vs Jotai](https://www.agilesoftlabs.com/blog/2026/06/react-native-state-2026-zustand-vs)
- [Offline-First React Native: SQLite, MMKV, Sync Queue](https://www.faisalkhawaj.com/blog/offline-first-react-native)
