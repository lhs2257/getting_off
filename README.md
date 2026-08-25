# Getting Off

출퇴근 경로를 저장하고 버튼 하나로 하차 알림을 받는 교통 알림 앱입니다.

## 소개

지하철이나 버스에서 졸거나 스마트폰에 집중하다 내릴 역을 놓친 경험이 있으신가요?

Getting Off는 출퇴근 경로를 한 번만 저장하면, 매일 "출퇴근 시작" 한 번의 탭으로 정거장 접근 알림, 하차 알림, 환승 안내를 자동으로 받을 수 있는 앱입니다.

### 주요 기능

- **경로 저장** - 출발지/도착지 검색 후 대중교통 경로를 저장
- **하차 알림** - GPS 기반으로 하차역 접근 시 알림
- **환승 안내** - 환승 지점에서 도보 시간과 다음 노선 정보 제공
- **실시간 도착정보** - 버스/지하철 실시간 도착 시간 표시
- **백그라운드 추적** - 앱을 꺼도 위치 추적 및 알림 지속

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React Native + Expo SDK 54 |
| 언어 | TypeScript |
| 상태 관리 | Zustand |
| 로컬 DB | expo-sqlite |
| 위치 추적 | expo-location + expo-task-manager |
| 알림 | expo-notifications |
| API | 카카오 로컬/모빌리티, 서울열린데이터광장 |

## 시작하기

### 사전 요구사항

- Node.js 18+
- Expo Go 앱 (iOS/Android)

### 설치

```bash
git clone https://github.com/lhs2257/getting_off.git
cd getting_off/src
npm install
```

### 환경변수 설정

`src/.env` 파일을 생성하고 API 키를 입력합니다.

```
EXPO_PUBLIC_SEOUL_API_KEY=서울열린데이터광장_인증키
EXPO_PUBLIC_KAKAO_API_KEY=카카오_REST_API_키
```

- 서울열린데이터광장: https://data.seoul.go.kr
- 카카오 개발자: https://developers.kakao.com

### 실행

```bash
cd src
npx expo start
```

Expo Go 앱에서 QR 코드를 스캔하여 실행합니다.

## 프로젝트 구조

```
src/
  core/           앱 진입점, 네비게이션
  pages/          화면 (홈, 경로탐색, 출퇴근, 설정)
  features/       비즈니스 기능 (경로검색, 출퇴근세션, 실시간정보, 환승안내)
  entities/       도메인 모델 (경로, 정거장, 사용자)
  widgets/        독립 UI 블록 (경로카드, 지도)
  shared/         공통 유틸, API 클라이언트, 훅
  services/       백그라운드 위치 추적, 알림
```

## 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| `main` | 배포 (안정 버전) |
| `develop` | 개발 (일상 작업) |

## 라이선스

MIT
