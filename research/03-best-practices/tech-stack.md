# 기술 스택 리서치

## 종합 비교표

| 평가 항목 | Expo Managed | RN Bare | Flutter |
|---|:---:|:---:|:---:|
| 백그라운드 위치 추적 | 제한적 | 가능 | 가능 |
| 푸시 알림 구현 난이도 | 낮음 | 중간 | 중간 |
| GPS 서비스 지원 | 기본 | 완전 | 완전 |
| 초기 개발 속도 | 매우 빠름 | 느림 | 중간 |
| 생태계 성숙도 | 높음 | 높음 | 성장 중 |
| 네이티브 설정 부담 | 없음 | 높음 | 낮음 |
| 장기 유지보수성 | 중간 | 중간 | 높음 |

## 최종 추천: React Native (Expo) -> bare 점진적 전환

### 선택 이유

1. 빠른 개발 우선 조건에 가장 부합
2. 공공 API 연동은 REST 기반이므로 플랫폼 무관
3. 백그라운드 위치 추적 한계는 `expo prebuild`로 bare 전환하여 해결
4. JavaScript/TypeScript 기반이면 학습 비용 0
5. 한국 개발자 커뮤니티 레퍼런스 풍부

### 권장 기술 스택

| 분류 | 기술 | 선택 이유 |
|------|------|----------|
| 프레임워크 | React Native + Expo SDK 53 | 크로스플랫폼, 백그라운드 API 안정화 |
| 언어 | TypeScript | 타입 안전성 |
| 상태 관리 | Zustand + React Query | 경량, 서버 상태 캐싱 분리 |
| 로컬 DB | expo-sqlite | GTFS 정적 데이터 쿼리 |
| 빠른 스토리지 | react-native-mmkv | 세션/설정 영속화 |
| 위치 추적 | expo-location + expo-task-manager | 백그라운드 위치, 지오펜싱 |
| 알림 | expo-notifications | 로컬 알림, 예약 알림 |
| 지도 | react-native-maps | 실시간 위치 시각화 |
| 네트워킹 | Axios + React Query | API 요청 + 캐싱 |

### 보조 권고

- 백그라운드 GPS가 핵심 차별점이라면 `react-native-background-geolocation` (Transistorsoft) 도입 고려
- Expo Managed만으로는 실시간 위치 기반 알림 완전 구현 어려움 -> bare 전환 계획 포함 필수

## 출처

- [Flutter vs React Native: 46% vs 35% Market Share (2026)](https://tech-insider.org/flutter-vs-react-native-2026/)
- [Expo vs Bare React Native in 2026](https://hirereactnativedevs.com/blog/expo-vs-bare-react-native)
- [Top React Native Background Geolocation for Apps 2026](https://differ.blog/p/top-react-native-background-geolocation-for-apps-2026-0803f9)
