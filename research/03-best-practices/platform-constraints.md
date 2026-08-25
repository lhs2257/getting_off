# 플랫폼 결정: 네이티브 앱

## 결론

**React Native + Expo 기반 네이티브 앱**으로 개발합니다. 웹(PWA)은 요구사항을 충족할 수 없습니다.

## 결정 근거

핵심 요구사항은 "상태바의 시계 옆 영역에 실시간 알림이 상주할 것"입니다.
이는 iOS의 Live Activities(Dynamic Island)와 Android 16의 Live Updates(상태바 칩)에 해당하며,
두 기능 모두 **웹 플랫폼에서 접근 자체가 불가능한 OS 레벨 API**입니다.

| 요구사항 | 웹(PWA) | 네이티브 |
|----------|---------|----------|
| 상태바 시계 옆 상시 표시 | 불가 | 가능 |
| Dynamic Island 표시 | 불가 | 가능 |
| 잠금화면 실시간 갱신 | 불가 | 가능 |
| 백그라운드 상시 추적 | 불가 | 가능 |
| 음성 알림 제어 | 제약 큼 | 자유로움 |

## iOS: Live Activities (ActivityKit)

| 항목 | 내용 |
|------|------|
| 최소 버전 | iOS 16.1 이상 |
| Dynamic Island | iPhone 14 Pro 이상에서만 표시 |
| 그 외 기기 | 잠금화면 위젯 형태로 표시 |
| 지속 시간 | 활성 최대 8시간, 종료 후 잠금화면에 최대 4시간 잔류 |
| 갱신 방법 | 앱 내 직접 갱신 또는 APNs 푸시 갱신 |
| 구현 | SwiftUI 위젯 익스텐션 + Expo config plugin |

통근 시간은 대부분 1시간 이내이므로 8시간 제한은 실사용에 영향이 없습니다.

## Android: Live Updates

| 항목 | 내용 |
|------|------|
| 상태바 칩 | Android 16 QPR1 (API 36.1) 이상 |
| 핵심 API | `Notification.ProgressStyle`, `setShortCriticalText`, `setRequestPromotedOngoing` |
| 표시 위치 | 알림함 최상단, 잠금화면 강조, 셰이드 닫힘 시 상태바 칩 |
| 하위 버전 대응 | 포그라운드 서비스 + 상시 알림으로 대체 (상태바 아이콘은 표시되나 칩 형태는 아님) |

`setShortCriticalText`에 "3정거장 전", "다음역 하차" 같은 짧은 문구를 넣는 것이 핵심입니다.

## 추적 실행 구조의 비대칭

두 OS의 백그라운드 정책이 달라 추적 주체를 다르게 가져갑니다.

| 플랫폼 | 추적 주체 | 서버 필요 여부 |
|--------|-----------|----------------|
| Android | 포그라운드 서비스가 기기에서 직접 폴링 | 불필요 |
| iOS | 서버 워커가 폴링 후 APNs로 Live Activity 갱신 | 필요 |

따라서 Android를 먼저 구현하면 서버 없이 전체 플로우를 검증할 수 있습니다.
이를 구현 순서에 반영합니다.

## 전제 조건

- Expo Go로는 실행 불가. Development Build 및 EAS Build 사용
- iOS 실기기 테스트 및 배포에 Apple Developer Program 필요 (연 99달러)
- Android는 Google Play Console 최초 등록비 필요 (1회 25달러)

## 참고

- expo-live-activity: https://github.com/software-mansion-labs/expo-live-activity
- react-native-activity-kit: https://www.npmjs.com/package/@kingstinct/react-native-activity-kit
- Android Live Update 공식 문서: https://developer.android.com/develop/ui/views/notifications/live-update
- iOS Live Activities 가이드: https://newly.app/guides/ios-live-activities
