import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../app/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Getting Off</Text>
      <Text style={styles.subtitle}>출퇴근 교통 알림</Text>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('RouteSearch')}
      >
        <Text style={styles.searchButtonText}>경로 탐색</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A73E8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
  },
  searchButton: {
    backgroundColor: '#1A73E8',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
