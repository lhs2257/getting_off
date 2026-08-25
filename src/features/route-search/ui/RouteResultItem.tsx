import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { OdsayPath } from '../../../entities/route/model/types';

interface Props {
  path: OdsayPath;
  onPress: (path: OdsayPath) => void;
}

const PATH_TYPE_LABELS: Record<number, string> = {
  1: '지하철',
  2: '버스',
  3: '지하철+버스',
};

const TRAFFIC_TYPE_COLORS: Record<number, string> = {
  1: '#1A73E8', // 지하철
  2: '#34A853', // 버스
  3: '#999',    // 도보
};

export default function RouteResultItem({ path, onPress }: Props) {
  const { info, subPath, pathType } = path;

  const transitSummary = subPath
    .filter((sp) => sp.trafficType !== 3)
    .map((sp) => {
      const laneName = sp.lane?.[0]?.name ?? sp.lane?.[0]?.busNo ?? '';
      return laneName;
    })
    .join(' > ');

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(path)}>
      <View style={styles.header}>
        <Text style={styles.pathType}>
          {PATH_TYPE_LABELS[pathType] ?? '복합'}
        </Text>
        <Text style={styles.totalTime}>{info.totalTime}분</Text>
      </View>

      <Text style={styles.transitSummary} numberOfLines={2}>
        {transitSummary}
      </Text>

      <View style={styles.subPathRow}>
        {subPath.map((sp, i) => (
          <View key={i} style={styles.subPathSegment}>
            <View
              style={[
                styles.segmentDot,
                { backgroundColor: TRAFFIC_TYPE_COLORS[sp.trafficType] ?? '#999' },
              ]}
            />
            <Text style={styles.segmentText}>
              {sp.trafficType === 3
                ? `도보 ${sp.sectionTime}분`
                : `${sp.sectionTime}분`}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          환승 {info.busTransitCount + info.subwayTransitCount}회
        </Text>
        <Text style={styles.footerText}>
          {info.payment.toLocaleString()}원
        </Text>
        <Text style={styles.footerText}>
          도보 {Math.round(info.totalWalk / 60)}분
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pathType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A73E8',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  totalTime: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  transitSummary: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  subPathRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  subPathSegment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  segmentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  segmentText: {
    fontSize: 12,
    color: '#777',
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
