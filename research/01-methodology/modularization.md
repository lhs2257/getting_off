# 모듈화 방법론 선정

## 결론

**경량 Feature-Sliced Design(FSD)** 을 채택합니다. 정식 FSD의 6개 레이어를 모두 쓰지 않고,
`app / views / features / entities / shared` 5개 레이어로 축소하여 적용합니다.

## 선정 근거

| 후보 | 장점 | 단점 | 판정 |
|------|------|------|------|
| Atomic Design | UI 재사용에 강함 | 비즈니스 로직 배치 기준이 없음 | 부적합 |
| 정식 FSD (6레이어) | 경계가 명확, 대규모 확장에 강함 | 기능 20개 미만에서는 보일러플레이트 과다 | 과함 |
| 경량 FSD (5레이어) | 도메인 경계 유지 + 초기 속도 확보 | 레이어 규칙을 직접 지켜야 함 | **채택** |
| 단순 기능 폴더 | 가장 빠름 | 위치/알림/노선 로직이 뒤섞이기 쉬움 | 부적합 |

하차 알림 서비스는 위치 추적, 알림, 노선 검색, 즐겨찾기가 서로 다른 생명주기를 가집니다.
특히 위치 추적은 백그라운드 제약 때문에 언제든 구현 방식이 교체될 수 있으므로,
`features/location-tracking` 하나로 격리해 두는 것이 교체 비용을 최소화합니다.

## 레이어 규칙

- 상위 레이어만 하위 레이어를 import 합니다: `app -> views -> features -> entities -> shared`
- 같은 레이어 내 슬라이스끼리는 직접 import 하지 않습니다
- 각 슬라이스는 `ui / model / api / lib` 세그먼트로 내부를 나눕니다
- 슬라이스 외부로는 `index.ts` 공개 API를 통해서만 노출합니다

## 작업 분해(Task Decomposition) 전략

WBS 3단계 분해를 사용합니다.

- 레벨 1: 마일스톤 (예: M1 기반 세팅)
- 레벨 2: 작업 단위 (예: T1-2 지도 렌더링)
- 레벨 3: 체크 항목 (PROGRESS.md의 체크박스)

레벨 2 작업 하나는 반나절 이내에 끝나고 독립적으로 검증 가능한 크기로 유지합니다.

## 참고

- Feature-Sliced Design 공식 문서: https://feature-sliced.design/docs/guides/tech/with-nextjs
- Next.js App Router 가이드: https://feature-sliced.design/blog/nextjs-app-router-guide
