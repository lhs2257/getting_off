import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { SavedRoute } from '../../entities/route/model/SavedRoute';

interface Props {
  route: SavedRoute;
  onPress: (route: SavedRoute) => void;
  onDelete: (route: SavedRoute) => void;
}

const TYPE_LABELS: Record<number, string> = {
  1: '지하철',
  2: '버스',
  3: '지하철+버스',
};

export default function SavedRouteCard({ route, onPress, onDelete }: Props) {
  const { path } = route;
  const pathTypeLabel = TYPE_LABELS[path.pathType] ?? '복합';

  const transitNames = path.subPath
    .filter((sp) => sp.trafficType !== 3)
    .map((sp) => sp.lane?.[0]?.name ?? sp.lane?.[0]?.busNo ?? '')
    .filter(Boolean)
    .join(' > ');

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(route)}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{route.name}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(route)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.badge}>{pathTypeLabel}</Text>
        <Text style={styles.time}>{path.info.totalTime}분</Text>
        <Text style={styles.detail}>
          환승 {path.info.busTransitCount + path.info.subwayTransitCount}회
        </Text>
        <Text style={styles.detail}>
          {path.info.payment.toLocaleString()}원
        </Text>
      </View>

      {transitNames.length > 0 && (
        <Text style={styles.transit} numberOfLines={1}>{transitNames}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 13,
    color: '#E53935',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A73E8',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  time: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  detail: {
    fontSize: 12,
    color: '#999',
  },
  transit: {
    fontSize: 13,
    color: '#666',
  },
});
