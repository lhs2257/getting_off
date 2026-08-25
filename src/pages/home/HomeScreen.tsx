import { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../app/navigation';
import type { SavedRoute } from '../../entities/route/model/SavedRoute';
import { getAllRoutes, deleteRoute } from '../../entities/route/api/routeStorage';
import SavedRouteCard from '../../widgets/route-card/SavedRouteCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadRoutes();
    }, []),
  );

  const loadRoutes = async () => {
    try {
      const saved = await getAllRoutes();
      setRoutes(saved);
    } catch {
      setRoutes([]);
    }
  };

  const handleRoutePress = (_route: SavedRoute) => {
    // Phase 3에서 출퇴근 세션 시작 기능 연동 예정
  };

  const handleDeleteRoute = (route: SavedRoute) => {
    Alert.alert(
      '경로 삭제',
      `"${route.name}" 경로를 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await deleteRoute(route.id);
            loadRoutes();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {routes.length > 0 ? (
        <FlatList
          data={routes}
          keyExtractor={(item) => `saved-${item.id}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <SavedRouteCard
              route={item}
              onPress={handleRoutePress}
              onDelete={handleDeleteRoute}
            />
          )}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>저장된 경로</Text>
          }
        />
      ) : (
        <View style={styles.emptySection}>
          <Text style={styles.emptyTitle}>저장된 경로가 없습니다</Text>
          <Text style={styles.emptySubtitle}>
            경로를 탐색하고 저장해보세요
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('RouteSearch')}
      >
        <Text style={styles.searchButtonText}>+ 경로 탐색</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
  },
  emptySection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
  },
  searchButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#1A73E8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
