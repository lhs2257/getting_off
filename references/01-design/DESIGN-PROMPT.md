# 디자인 레퍼런스 생성 프롬프트

이 문서는 AI 이미지/UI 생성 도구(Midjourney, Figma AI, v0, Claude, ChatGPT 등)에
입력하여 디자인 시안을 만들기 위한 프롬프트 모음입니다.

생성된 결과물은 `references/01-design/` 에 저장한 뒤 개발에 반영합니다.

## 사용 방법

1. 아래 프롬프트 중 필요한 화면을 골라 복사합니다
2. 도구에 붙여넣어 시안을 생성합니다
3. 마음에 드는 결과를 `references/01-design/[화면명]-v1.png` 형태로 저장합니다
4. Claude Code에게 저장 완료를 알리면 분석하여 구현에 반영합니다

## 공통 스타일 지시문

모든 프롬프트 앞에 아래 블록을 함께 넣으면 화면 간 톤이 일치합니다.

```text
Design a mobile app UI for a Korean public transit alert app.

Brand & tone:
- Product: real-time subway and bus ride tracker with get-off alerts
- Mood: calm, trustworthy, glanceable in one second while standing on a moving train
- Not playful, not corporate. Quiet confidence.

Visual system:
- Dark mode first, with a light mode counterpart
- Base: near-black #0B0D10 surfaces, elevated cards #16191F
- Accent: a single vivid signal color used sparingly, only for the currently tracked vehicle
- Subway line colors used strictly as small identifiers, never as large fills
- Typography: Korean sans-serif (Pretendard), tight tracking, strong weight contrast
  between the primary number and its label
- Corner radius 16px on cards, 999px on chips
- Generous vertical rhythm, no dense borders, separation by spacing not by lines
- One-handed reach: primary actions in the bottom third of the screen

Content rules:
- All UI text in Korean
- Numbers dominate: minutes remaining and stops remaining are the largest elements
- No decorative illustration, no stock imagery
- Realistic Seoul station and bus route names

Output: high-fidelity mobile screen, 1080x2340, no device frame, no annotations.
```

## 화면별 프롬프트

### 1. 홈 (즐겨찾기 및 최근 경로)

```text
Screen: Home.
A vertical list of saved commute routes as cards. Each card shows the origin stop,
the destination stop, the transport mode icon (subway line badge or bus number badge),
and a live "다음 차량 3분" indicator. One card is visually promoted as the most likely
current commute based on time of day, with a large "탑승 시작" button.
A compact search field is pinned at the top. Bottom safe area kept clear.
```

### 2. 검색 (역/정류소)

```text
Screen: Search.
A focused search input at the top with the Korean placeholder "역 또는 정류소 검색".
Below it, results grouped into two labeled sections: 지하철 and 버스.
Subway results show a small colored line badge plus station name.
Bus results show the route number badge plus the stop name and a short direction hint.
Recent searches appear as removable chips above the results when the query is empty.
```

### 3. 탑승 차량 선택

```text
Screen: Vehicle selection at a station.
Header shows the station name and the direction. Below, a list of upcoming vehicles,
each row showing arrival in minutes as the dominant number, the destination terminus,
and a subtle congestion indicator. Tapping a row selects it. The first row is highlighted
as the recommended choice. A persistent bottom bar reads "이 열차로 탑승 시작".
```

### 4. 탑승 중 (핵심 화면)

```text
Screen: Riding. This is the signature screen.
A horizontal route strip runs across the middle of the screen, mimicking the in-train
LED destination board: stations laid out left to right on a single line, passed stations
dimmed, the current vehicle marked by a glowing dot between two stations, and the
destination station marked with a distinct target indicator.
Above the strip: the current station name in large Korean type.
Below the strip: "3정거장 남음" and "약 7분" as two large numeric readouts side by side.
At the bottom: a wide card previewing the transfer or exit guidance.
Everything must be readable at arm's length in one glance.
```

### 5. 환승 안내 (차별화 화면)

```text
Screen: Transfer guidance.
Top section shows the arriving vehicle and the station where the user gets off.
Middle section visualizes the transfer as a horizontal timeline with three segments:
하차, 도보 이동 (with walking minutes), 다음 차량 탑승.
The walking segment shows distance and estimated minutes based on walking speed.
Bottom section shows the next vehicle options with a clear verdict badge on each:
green "여유 있음", amber "서두르면 탑승 가능", red "다음 차량 권장".
The verdict badge is the most prominent element after the timeline.
```

### 6. 알림 설정

```text
Screen: Notification settings.
Grouped settings list. Group 1 알림 시점: toggles for 정거장마다 알림 and
하차 N정거장 전 알림 with a stepper. Group 2 알림 방식: segmented control for
진동 / 소리 / 음성, with separate settings for 탑승 중 and 하차 임박.
Group 3 보행 속도: a three-option selector 빠르게 / 보통 / 천천히 with a short
explanatory caption. Clean iOS-style grouped rows on dark surfaces.
```

## 상태바 알림 프롬프트

이 두 가지는 앱 화면이 아니라 OS 알림 영역의 디자인입니다.

### iOS Dynamic Island

```text
Design an iOS Live Activity for a subway ride tracker, shown in three states.

State 1 - Dynamic Island compact: to the left of the clock area, a tiny subway line
color dot; to the right, the text "3정거장". Extremely minimal, fits the pill.

State 2 - Dynamic Island expanded: leading side shows the current station name,
trailing side shows "3정거장 · 7분", bottom shows a thin horizontal progress line
representing remaining stations with the destination marked.

State 3 - Lock screen widget: a wide card with the line badge, current station,
remaining stops as the dominant number, destination station, and the same horizontal
progress line. Dark translucent material background.

Korean text throughout. Glanceable, no clutter.
```

### Android 상태바 칩 및 Live Update

```text
Design an Android 16 Live Update notification for a subway ride tracker.

State 1 - Status bar chip: a compact pill next to the clock showing a line color dot
and the short critical text "3정거장".

State 2 - Expanded notification: uses ProgressStyle. Title is the current station,
subtitle is the destination, and a segmented progress bar shows each remaining station
as a discrete milestone with the current position highlighted. A trailing readout
shows "약 7분". Two actions at the bottom: 알림 끄기 and 앱 열기.

Material 3 expressive styling, dark theme, Korean text.
```

## 참고 앱

- 이번정거장 (thisstop.co.kr): 가로형 노선도 UI와 알림 세분화 방식
- 카카오맵 / 네이버지도: 대중교통 정보 밀도와 한글 타이포그래피 처리
- Citymapper: 환승 안내의 정보 위계 설계
