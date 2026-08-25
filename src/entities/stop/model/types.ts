/**
 * 서울열린데이터광장 버스 도착정보 응답
 * API: getArrInfoByRouteAll
 */
export interface SeoulBusArrivalResponse {
  msgBody: {
    itemList: SeoulBusArrival[];
  };
}

export interface SeoulBusArrival {
  stId: string;       // 정류소 ID
  stNm: string;       // 정류소명
  arsId: string;      // 정류소 고유번호
  busRouteId: string; // 노선 ID
  rtNm: string;       // 노선명 (예: 143)
  busRouteAbrv: string; // 노선 약칭
  sectOrd: string;    // 구간 순서
  staOrd: string;     // 정류소 순서
  arrmsg1: string;    // 첫번째 도착 메시지 (예: "3분12초후[2번째 전]")
  arrmsg2: string;    // 두번째 도착 메시지
  traTime1: string;   // 첫번째 도착 예상시간 (초)
  traTime2: string;   // 두번째 도착 예상시간 (초)
  isArrive1: string;  // 첫번째 도착 여부 (0/1)
  isArrive2: string;  // 두번째 도착 여부 (0/1)
  repTm1: string;     // GPS 보고 시각
}

/**
 * 서울열린데이터광장 지하철 실시간 도착정보 응답
 * API: realtimeStationArrival
 */
export interface SeoulSubwayArrivalResponse {
  realtimeArrivalList: SeoulSubwayArrival[];
}

export interface SeoulSubwayArrival {
  subwayId: string;     // 노선 ID
  updnLine: string;     // 상/하행 ("상행", "하행")
  trainLineNm: string;  // 노선명 (예: "2호선")
  statnNm: string;      // 역명
  bstatnNm: string;     // 종착역명
  arvlMsg2: string;     // 도착 메시지 (예: "전역 도착", "3분 후")
  arvlMsg3: string;     // 도착 메시지 상세
  arvlCd: string;       // 도착 코드 (0:진입, 1:도착, 2:출발, 3:전역출발, 4:전역진입, 5:전역도착, 99:운행중)
  btrainNo: string;     // 열차 번호
  recptnDt: string;     // 데이터 수신 시각
  barvlDt: string;      // 도착 예정 시간 (초)
  btrainSttus: string;  // 열차 상태 (일반/급행)
  ordkey: string;       // 정렬 키
}

/**
 * 통합 실시간 도착정보 (버스/지하철 공통)
 */
export interface RealtimeArrival {
  type: 'bus' | 'subway';
  lineName: string;       // 노선명
  destination: string;    // 행선지/종착역
  arrivalMessage: string; // 도착 메시지
  arrivalSeconds: number; // 도착 예상 시간 (초)
  isArriving: boolean;    // 곧 도착 여부
}
