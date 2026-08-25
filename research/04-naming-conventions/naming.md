# 네이밍 컨벤션

## 파일 및 폴더

| 대상 | 규칙 | 예시 |
|------|------|------|
| 폴더(슬라이스) | kebab-case | `location-tracking` |
| React 컴포넌트 파일 | PascalCase | `StopSearchInput.tsx` |
| 훅 파일 | camelCase, `use` 접두 | `useWatchPosition.ts` |
| 유틸/모듈 파일 | camelCase | `haversine.ts` |
| 타입 정의 파일 | `types.ts` | `entities/stop/types.ts` |
| 공개 API | `index.ts` | `features/alarm/index.ts` |
| Next.js 라우트 | 프레임워크 규칙 준수 | `app/search/page.tsx` |

## 코드 식별자

- 변수/함수: camelCase, 영문
- 타입/인터페이스: PascalCase, 접두사(`I`, `T`) 사용 안 함
- 상수: UPPER_SNAKE_CASE
- 불리언: `is`, `has`, `should` 접두 (`isTracking`, `hasArrived`)
- 이벤트 핸들러: `handle` 접두 (`handleStopSelect`)
- 도메인 용어는 영문으로 통일합니다: 정류소=`stop`, 노선=`route`, 도착=`arrival`, 알림=`alarm`

## 문서

CLAUDE.md의 규칙을 그대로 따릅니다.

- 프로젝트 개요: `PROJECT.md`
- 작업 현황: `PROGRESS.md`
- 모듈 문서: `[module-path]/README.md`
- 설계 결정: `docs/decisions/ADR-[NNN]-[title].md`
- 명세서: `docs/specs/SPEC-[feature-name].md`
- 진행 로그: `docs/logs/YYYY-MM-DD-[description].md`

## 작업 ID

- 마일스톤: `M1`, `M2`
- 작업: `T1-1`, `T1-2` (마일스톤 번호 - 순번)
