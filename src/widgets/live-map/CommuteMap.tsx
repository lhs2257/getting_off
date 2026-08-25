import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { LocationState } from '../../shared/hooks/useLocationTracking';
import type { OdsaySubPath } from '../../entities/route/model/types';

// TODO: 네이티브 빌드 시 react-native-maps로 교체
// Expo Go 호환을 위해 텍스트 기반 경로 표시 사용

interface Props {
  location: LocationState | null;
  subPaths: OdsaySubPath[];
  currentSubPathIndex: number;
}

const TRAFFIC_LABELS: Record<number, string> = {
  1: '[지하철]',
  2: '[버스]',
  3: '[도보]',
};

const TRAFFIC_COLORS: Record<number, string> = {
  1: '#1A73E8',
  2: '#34A853',
  3: '#999',
};

export default function CommuteMap({ location, subPaths, currentSubPathIndex }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.toggleText}>
          {expanded ? '경로 상세 접기' : '경로 상세 보기'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <ScrollView style={styles.detailBox} nestedScrollEnabled>
          {location && (
            <Text style={styles.locationInfo}>
              현재 위치: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </Text>
          )}

          {subPaths.map((sp, idx) => {
            const isPast = idx < currentSubPathIndex;
            const isActive = idx === currentSubPathIndex;
            const color = TRAFFIC_COLORS[sp.trafficType] ?? '#999';

            return (
              <View
                key={idx}
                style={[
                  styles.stopRow,
                  isPast && styles.stopRowPast,
                  isActive && styles.stopRowActive,
                ]}
              >
                <View style={[styles.dot, { backgroundColor: color }]} />
                <View style={styles.stopInfo}>
                  <Text style={[styles.typeLabel, { color }]}>
                    {TRAFFIC_LABELS[sp.trafficType] ?? ''}{' '}
                    {sp.lane?.[0]?.name ?? sp.lane?.[0]?.busNo ?? ''}
                  </Text>
                  <Text style={[styles.stopName, isPast && styles.textPast]}>
                    {sp.startName} → {sp.endName}
                  </Text>
                  <Text style={styles.stopMeta}>
                    {sp.sectionTime}분
                    {sp.stationCount > 0 ? ` / ${sp.stationCount}정거장` : ''}
                  </Text>
                  {isActive && (
                    <Text style={styles.activeTag}>-- 현재 구간 --</Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
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
  detailBox: {
    maxHeight: 220,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 8,
    padding: 12,
  },
  locationInfo: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    textAlign: 'center',
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  stopRowPast: {
    opacity: 0.4,
  },
  stopRowActive: {
    backgroundColor: '#FFF8E1',
    borderRadius: 6,
    marginHorizontal: -4,
    paddingHorizontal: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    marginRight: 10,
  },
  stopInfo: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  stopName: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  textPast: {
    color: '#BBB',
  },
  stopMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  activeTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F57C00',
    marginTop: 4,
  },
});
