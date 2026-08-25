# 폴더 구조 레퍼런스

## 전체 구조

```text
getting_off/
  app/                            # Expo Router (라우트 전용, 얇게 유지)
    _layout.tsx
    index.tsx                     # 홈: 즐겨찾기 + 최근 경로
    search.tsx                    # 역/정류소 검색
    board/[stopId].tsx            # 도착 목록에서 탑승 차량 선택
    riding/[rideId].tsx           # 탑승 중 가로형 노선도
    transfer/[rideId].tsx         # 환승 안내
    settings.tsx                  # 알림, 보행속도 설정
  src/
    views/                        # 화면 단위 조립
      home/  search/  board/  riding/  transfer/  settings/
    features/                     # 사용자 행위 단위
      stop-search/                # 역/정류소 검색
      vehicle-select/             # 탑승 차량 선택 및 변경
      ride-tracking/              # 탑승 추적 엔진
      transfer-planner/           # 환승 시간 계산 및 연결 판정
      live-notification/          # 상태바/Dynamic Island 알림 제어
      alarm-policy/               # 알림 시점 및 방식(진동/음성) 결정
      favorites/
    entities/                     # 도메인 모델 (지하철/버스 공통 추상화)
      vehicle/                    # 차량: 열차 또는 버스
      stop/                       # 정차 지점: 역 또는 정류소
      route/                      # 노선 및 정차 순서
      journey/                    # 환승을 포함한 전체 여정
      adapters/
        subway/                   # 서울 지하철 API 응답 -> 공통 모델
        bus/                      # 서울 버스 API 응답 -> 공통 모델
    shared/
      ui/                         # 공통 컴포넌트, 디자인 토큰
      lib/                        # 시간 계산, 포맷터
      api/                        # fetch 래퍼, 캐싱
      storage/                    # MMKV 래퍼
      config/                     # 환경변수, 상수
  modules/                        # 커스텀 Expo 네이티브 모듈
    live-activity/                # iOS ActivityKit + SwiftUI 위젯
    live-update/                  # Android ProgressStyle + 포그라운드 서비스
  server/                         # API 프록시 및 iOS APNs 푸시 워커
  data/                           # 역/정류소/노선/환승시간 정적 데이터
  assets/
  docs/
    decisions/  specs/  logs/
  references/
  research/
  PROJECT.md
  PROGRESS.md
```

## 슬라이스 내부 구조

```text
features/ride-tracking/
  ui/          # 컴포넌트
  model/       # Zustand 스토어, 상태 로직
  lib/         # 순수 함수
  README.md    # 모듈 문서 (필수)
  index.ts     # 공개 API
```

## 지하철과 버스의 공존 전략

추적, 환승 계산, 알림 로직은 교통수단을 구분하지 않습니다.
차이는 `entities/adapters/` 에서만 흡수하며, 상위 레이어는 공통 모델
(`Vehicle`, `Stop`, `Route`, `Journey`)만 다룹니다.
지하철을 먼저 구현한 뒤 버스를 추가할 때 어댑터와 데이터 소스만 추가하면 됩니다.

## 네이티브 모듈 경계

`modules/` 하위의 네이티브 코드는 **표시만 담당**합니다.
언제 무엇을 표시할지는 `features/live-notification`이 결정하고,
네이티브 모듈은 전달받은 상태를 렌더링하는 역할에 한정합니다.
이렇게 해야 iOS와 Android의 표시 방식 차이가 상위 로직으로 새지 않습니다.

## Expo Router와 FSD의 이름 충돌 처리

Expo Router가 `app/`을 예약하므로, FSD의 app 레이어는 두지 않고
루트 `app/`을 라우트 전용으로만 사용합니다. FSD의 pages 레이어는 `src/views/`로 이름을 바꿔 씁니다.

## 의존성 방향

```text
app -> views -> features -> entities -> shared
```

역방향 import는 금지합니다. 같은 레이어 내 슬라이스 간 직접 import도 금지하며,
필요하면 상위 레이어에서 조립합니다. `modules/`는 `features/live-notification`만 참조합니다.
