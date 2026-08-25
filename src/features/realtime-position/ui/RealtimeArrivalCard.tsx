import { StyleSheet, Text, View } from 'react-native';
import type { RealtimeArrival } from '../../../entities/stop/model/types';

interface Props {
  arrivals: RealtimeArrival[];
  stationName: string;
}

export default function RealtimeArrivalCard({ arrivals, stationName }: Props) {
  if (arrivals.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{stationName} 실시간 도착정보</Text>
      {arrivals.slice(0, 4).map((item, i) => (
        <View key={`${item.lineName}-${i}`} style={styles.row}>
          <View style={styles.lineTag}>
            <Text style={[
              styles.lineTagText,
              { color: item.type === 'bus' ? '#34A853' : '#1A73E8' },
            ]}>
              {item.lineName}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.destination}>{item.destination}</Text>
            <Text style={[
              styles.arrivalMsg,
              item.isArriving && styles.arrivalMsgUrgent,
            ]}>
              {item.arrivalMessage}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  lineTag: {
    width: 64,
  },
  lineTagText: {
    fontSize: 14,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destination: {
    fontSize: 13,
    color: '#666',
  },
  arrivalMsg: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  arrivalMsgUrgent: {
    color: '#E53935',
    fontWeight: '700',
  },
});
