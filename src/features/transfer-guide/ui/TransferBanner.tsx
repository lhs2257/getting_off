import { StyleSheet, Text, View } from 'react-native';
import type { TransferInfo } from '../model/types';

interface Props {
  transfer: TransferInfo;
  remainingStops: number;
}

const TYPE_LABELS: Record<number, string> = {
  1: '지하철',
  2: '버스',
};

export default function TransferBanner({ transfer, remainingStops }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>환승 안내</Text>
        {remainingStops > 0 && (
          <Text style={styles.remainingText}>{remainingStops}정거장 후 환승</Text>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.step}>
          <View style={[styles.dot, { backgroundColor: '#E53935' }]} />
          <Text style={styles.stepText}>
            {transfer.exitStopName}에서 하차
          </Text>
        </View>

        <View style={styles.walkRow}>
          <View style={styles.walkLine} />
          <Text style={styles.walkText}>
            도보 {transfer.walkingTimeFormatted} ({transfer.walkingDistance}m)
          </Text>
        </View>

        <View style={styles.step}>
          <View style={[styles.dot, { backgroundColor: '#1A73E8' }]} />
          <Text style={styles.stepText}>
            {transfer.nextBoardingStop}에서{' '}
            {TYPE_LABELS[transfer.nextTrafficType] ?? ''}{' '}
            <Text style={styles.laneName}>{transfer.nextLaneName}</Text> 탑승
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB300',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F57C00',
  },
  remainingText: {
    fontSize: 12,
    color: '#999',
  },
  body: {
    gap: 4,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
  },
  laneName: {
    fontWeight: '700',
    color: '#1A73E8',
  },
  walkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    gap: 8,
    paddingVertical: 2,
  },
  walkLine: {
    width: 2,
    height: 20,
    backgroundColor: '#FFB300',
  },
  walkText: {
    fontSize: 12,
    color: '#888',
  },
});
