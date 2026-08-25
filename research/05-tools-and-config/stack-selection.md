# 기술 스택 선정

## 결론

Expo(React Native) + TypeScript + Expo Router + NativeWind + Zustand 구성을 채택합니다.
네이티브 알림 표시는 Swift/Kotlin으로 작성한 Expo 모듈로 처리합니다.

## 항목별 근거

| 영역 | 선택 | 근거 |
|------|------|------|
| 플랫폼 | React Native (Expo) | 한 코드베이스로 iOS/Android 동시 대응. 개발 속도 우선 원칙에 부합 |
| 빌드 | Expo Development Build + EAS Build | 네이티브 모듈이 필요하므로 Expo Go는 사용 불가. EAS로 Mac 없이도 iOS 빌드 가능 |
| 언어 | TypeScript | 공공 API 응답 필드가 축약형이라 타입 정의가 문서 역할을 함 |
| 라우팅 | Expo Router | 파일 기반 라우팅. 화면 수가 적어 학습 비용이 거의 없음 |
| 스타일 | NativeWind | Tailwind 문법을 RN에 그대로 사용. 디자인 반복 속도가 빠름 |
| 상태 관리 | Zustand | 추적 상태가 전역이면서 고빈도 갱신. Context 대비 리렌더 비용이 낮음 |
| iOS 알림 | ActivityKit + SwiftUI 위젯 익스텐션 | Live Activities / Dynamic Island 표시의 유일한 경로 |
| Android 알림 | Notification.ProgressStyle + 포그라운드 서비스 | 상태바 칩 표시 및 기기 내 상시 추적 |
| 서버 | Hono on Node (또는 Supabase Edge Functions) | API 키 은닉, iOS용 APNs 푸시 워커 |
| 저장소 | MMKV | 즐겨찾기, 설정 등 로컬 저장. AsyncStorage보다 빠름 |

## 기각한 대안

- **웹(PWA)**: 상태바 상시 알림이 원천적으로 불가능합니다. 요구사항 미충족
- **Flutter**: 기술적으로는 가능하나 Dart 학습 비용이 발생합니다
- **완전 네이티브(Swift + Kotlin 각각)**: 알림 품질은 최상이나 개발 공수가 두 배입니다
- **Redux Toolkit**: 이 규모에서는 보일러플레이트가 과합니다

## 네이티브 모듈 후보

| 라이브러리 | 용도 | 비고 |
|-----------|------|------|
| expo-live-activity | iOS Live Activities | Software Mansion 제작, Expo 친화적 |
| @kingstinct/react-native-activity-kit | iOS Live Activities 대안 | config plugin 제공 |
| expo-notifications | 공통 알림 기반 | 권한 및 로컬 알림 |
| expo-task-manager | 백그라운드 작업 | Android 포그라운드 서비스 연계 |

라이브러리로 커버되지 않는 부분은 직접 Expo 모듈을 작성합니다.

## 개발 환경 전제

- Node.js 20 LTS 이상, 패키지 매니저는 pnpm
- Android 실기기 (상태바 칩 확인에는 Android 16 QPR1 이상 권장)
- iOS 실기기 및 Apple Developer Program (연 99달러)
- Google Play Console 등록비 (1회 25달러)
