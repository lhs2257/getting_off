import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../app/navigation';
import { useCommuteStore } from '../../features/commute-session/model/useCommuteStore';
import { useLocationTracking } from '../../shared/hooks/useLocationTracking';
import { useStopDetection } from '../../features/commute-session/lib/useStopDetection';

type Props = NativeStackScreenProps<RootStackParamList, 'Commute'>;

const TRAFFIC_TYPE_LABELS: Record<number, string> = {
  1: '지하철',
  2: '버스',
  3: '도보',
};

const TRAFFIC_TYPE_COLORS: Record<number, string> = {
  1: '#1A73E8',
  2: '#34A853',
  3: '#999',
};

export default function CommuteScreen({ navigation }: Props) {
  const { status, route, currentSubPathIndex, stopSession, getCurrentSubPath } =
    useCommuteStore();
  const { location, error: locationError } = useLocationTracking(status === 'active');
  const currentSubPath = getCurrentSubPath();
  const { currentStopName, stopStatus, remainingStops, distanceToNext } =
    useStopDetection(location, currentSubPath);

  if (!route || status === 'idle') {
    navigation.goBack();
    return null;
  }

  const { path } = route;
  const { subPath } = path;

  const handleStop = () => {
    Alert.alert(
      '출퇴근 종료',
      '출퇴근 세션을 종료하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '종료',
          style: 'destructive',
          onPress: () => {
            stopSession();
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.routeName}>{route.name}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            총 {path.info.totalTime}분
          </Text>
          <Text style={styles.summaryDivider}>|</Text>
          <Text style={styles.summaryText}>
            {path.info.payment.toLocaleString()}원
          </Text>
          <Text style={styles.summaryDivider}>|</Text>
          <Text style={styles.summaryText}>
            환승 {path.info.busTransitCount + path.info.subwayTransitCount}회
          </Text>
        </View>
        <View style={styles.locationRow}>
          <View style={[styles.locationDot, { backgroundColor: location ? '#4CAF50' : '#FF9800' }]} />
          <Text style={styles.locationText}>
            {locationError
              ? locationError
              : location
                ? `위치 추적 중 (정확도: ${Math.round(location.accuracy ?? 0)}m)`
                : '위치 정보 대기 중...'}
          </Text>
        </View>
      </View>

      {currentStopName && (
        <View style={[
          styles.stopBanner,
          stopStatus === 'arrived' && styles.stopBannerArrived,
          stopStatus === 'approaching' && styles.stopBannerApproaching,
        ]}>
          <Text style={styles.stopBannerLabel}>
            {stopStatus === 'arrived' ? '현재 정거장' : '접근 중'}
          </Text>
          <Text style={styles.stopBannerName}>{currentStopName}</Text>
          <View style={styles.stopBannerInfo}>
            {remainingStops > 0 && (
              <Text style={styles.stopBannerDetail}>
                {remainingStops}정거장 남음
              </Text>
            )}
            {distanceToNext !== null && (
              <Text style={styles.stopBannerDetail}>
                {distanceToNext < 1000
                  ? `${Math.round(distanceToNext)}m`
                  : `${(distanceToNext / 1000).toFixed(1)}km`}
              </Text>
            )}
          </View>
        </View>
      )}

      <ScrollView style={styles.timeline} contentContainerStyle={styles.timelineContent}>
        {subPath.map((sp, index) => {
          const isActive = index === currentSubPathIndex;
          const isPast = index < currentSubPathIndex;
          const color = TRAFFIC_TYPE_COLORS[sp.trafficType] ?? '#999';

          return (
            <View key={index} style={styles.segment}>
              <View style={styles.segmentIndicator}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isPast ? '#ccc' : color,
                      borderWidth: isActive ? 3 : 0,
                      borderColor: isActive ? '#FFB300' : 'transparent',
                    },
                  ]}
                />
                {index < subPath.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      { backgroundColor: isPast ? '#E0E0E0' : color },
                    ]}
                  />
                )}
              </View>

              <View
                style={[
                  styles.segmentContent,
                  isActive && styles.segmentContentActive,
                ]}
              >
                <View style={styles.segmentHeader}>
                  <Text style={[styles.segmentType, { color }]}>
                    {TRAFFIC_TYPE_LABELS[sp.trafficType] ?? '기타'}
                  </Text>
                  {sp.lane?.[0] && (
                    <Text style={styles.laneName}>
                      {sp.lane[0].name ?? sp.lane[0].busNo}
                    </Text>
                  )}
                  <Text style={styles.sectionTime}>{sp.sectionTime}분</Text>
                </View>

                <Text style={styles.stationName}>{sp.startName}</Text>
                {sp.trafficType !== 3 && sp.stationCount > 0 && (
                  <Text style={styles.stationCount}>
                    {sp.stationCount}개 정거장
                  </Text>
                )}
                <Text style={styles.stationName}>{sp.endName}</Text>

                {isActive && (
                  <View style={styles.activeLabel}>
                    <Text style={styles.activeLabelText}>현재 구간</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
        <Text style={styles.stopButtonText}>출퇴근 종료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1A73E8',
    padding: 20,
    paddingTop: 12,
  },
  routeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  summaryDivider: {
    color: 'rgba(255,255,255,0.4)',
    marginHorizontal: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  locationText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  stopBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#999',
  },
  stopBannerApproaching: {
    backgroundColor: '#FFF8E1',
    borderLeftColor: '#FFB300',
  },
  stopBannerArrived: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: '#4CAF50',
  },
  stopBannerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    marginBottom: 2,
  },
  stopBannerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  stopBannerInfo: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  stopBannerDetail: {
    fontSize: 13,
    color: '#666',
  },
  timeline: {
    flex: 1,
  },
  timelineContent: {
    padding: 16,
    paddingBottom: 80,
  },
  segment: {
    flexDirection: 'row',
    minHeight: 80,
  },
  segmentIndicator: {
    width: 32,
    alignItems: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  line: {
    width: 3,
    flex: 1,
    marginVertical: 2,
  },
  segmentContent: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  segmentContentActive: {
    borderWidth: 2,
    borderColor: '#FFB300',
  },
  segmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  segmentType: {
    fontSize: 12,
    fontWeight: '600',
  },
  laneName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 'auto',
  },
  stationName: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  stationCount: {
    fontSize: 12,
    color: '#BBB',
    marginLeft: 8,
    marginVertical: 2,
  },
  activeLabel: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  activeLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F57C00',
  },
  stopButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#E53935',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
