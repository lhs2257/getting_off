import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import type { LocationState } from '../../shared/hooks/useLocationTracking';
import type { OdsaySubPath } from '../../entities/route/model/types';

interface Props {
  location: LocationState | null;
  subPaths: OdsaySubPath[];
  currentSubPathIndex: number;
}

const TRAFFIC_COLORS: Record<number, string> = {
  1: '#1A73E8', // 지하철
  2: '#34A853', // 버스
  3: '#BDBDBD', // 도보
};

export default function CommuteMap({ location, subPaths, currentSubPathIndex }: Props) {
  const [expanded, setExpanded] = useState(false);

  // 모든 구간의 정거장 좌표를 수집
  const allStops = subPaths.flatMap((sp) => {
    const stops: { latitude: number; longitude: number; name: string; type: number }[] = [];

    // 출발점
    if (sp.startX && sp.startY) {
      stops.push({
        latitude: sp.startY,
        longitude: sp.startX,
        name: sp.startName,
        type: sp.trafficType,
      });
    }

    // 경유 정거장
    if (sp.passStopList?.stations) {
      for (const st of sp.passStopList.stations) {
        stops.push({
          latitude: st.y,
          longitude: st.x,
          name: st.stationName,
          type: sp.trafficType,
        });
      }
    }

    // 도착점
    if (sp.endX && sp.endY) {
      stops.push({
        latitude: sp.endY,
        longitude: sp.endX,
        name: sp.endName,
        type: sp.trafficType,
      });
    }

    return stops;
  });

  // 구간별 경로선 좌표
  const polylines = subPaths.map((sp, idx) => {
    const coords: { latitude: number; longitude: number }[] = [];

    if (sp.startX && sp.startY) {
      coords.push({ latitude: sp.startY, longitude: sp.startX });
    }
    if (sp.passStopList?.stations) {
      for (const st of sp.passStopList.stations) {
        coords.push({ latitude: st.y, longitude: st.x });
      }
    }
    if (sp.endX && sp.endY) {
      coords.push({ latitude: sp.endY, longitude: sp.endX });
    }

    return {
      coords,
      color: TRAFFIC_COLORS[sp.trafficType] ?? '#999',
      isPast: idx < currentSubPathIndex,
      isActive: idx === currentSubPathIndex,
    };
  });

  // 초기 지도 영역 계산
  const centerLat = location?.latitude ?? (allStops[0]?.latitude ?? 37.5665);
  const centerLon = location?.longitude ?? (allStops[0]?.longitude ?? 126.978);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.toggleText}>{expanded ? '지도 접기' : '지도 보기'}</Text>
      </TouchableOpacity>

      {expanded && (
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            latitude: centerLat,
            longitude: centerLon,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
          showsMyLocationButton
        >
          {/* 경로선 */}
          {polylines.map((pl, i) =>
            pl.coords.length >= 2 ? (
              <Polyline
                key={`line-${i}`}
                coordinates={pl.coords}
                strokeColor={pl.isPast ? '#E0E0E0' : pl.color}
                strokeWidth={pl.isActive ? 5 : 3}
                lineDashPattern={pl.coords.length < 2 ? undefined : undefined}
              />
            ) : null,
          )}

          {/* 주요 정거장 마커: 각 구간의 출발/도착만 표시 */}
          {subPaths.map((sp, idx) => (
            <Marker
              key={`start-${idx}`}
              coordinate={{ latitude: sp.startY, longitude: sp.startX }}
              title={sp.startName}
              pinColor={idx <= currentSubPathIndex ? TRAFFIC_COLORS[sp.trafficType] : '#BDBDBD'}
            />
          ))}

          {/* 최종 도착 마커 */}
          {subPaths.length > 0 && (
            <Marker
              key="end-final"
              coordinate={{
                latitude: subPaths[subPaths.length - 1].endY,
                longitude: subPaths[subPaths.length - 1].endX,
              }}
              title={subPaths[subPaths.length - 1].endName}
              pinColor="#E53935"
            />
          )}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  toggleButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A73E8',
  },
  map: {
    height: 250,
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
  },
});
