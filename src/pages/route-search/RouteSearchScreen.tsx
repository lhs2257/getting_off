import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import StationSearchInput from '../../features/route-search/ui/StationSearchInput';
import RouteResultItem from '../../features/route-search/ui/RouteResultItem';
import { searchRoute } from '../../features/route-search/api';
import type { OdsayStation, OdsayPath } from '../../entities/route/model/types';
import { toRouteStation } from '../../entities/route/model/SavedRoute';
import { saveRoute } from '../../entities/route/api/routeStorage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../core/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RouteSearch'>;

export default function RouteSearchScreen({ navigation }: Props) {
  const [departureStation, setDepartureStation] = useState<OdsayStation | null>(null);
  const [arrivalStation, setArrivalStation] = useState<OdsayStation | null>(null);
  const [routes, setRoutes] = useState<OdsayPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const canSearch = departureStation !== null && arrivalStation !== null;

  const handleSwap = () => {
    const temp = departureStation;
    setDepartureStation(arrivalStation);
    setArrivalStation(temp);
    setRoutes([]);
    setSearched(false);
  };

  const handleSearch = async () => {
    if (!departureStation || !arrivalStation) return;

    setLoading(true);
    setSearched(true);
    try {
      const paths = await searchRoute(
        departureStation.x,
        departureStation.y,
        arrivalStation.x,
        arrivalStation.y,
      );
      setRoutes(paths);
    } catch (error) {
      Alert.alert('오류', '경로를 검색하지 못했습니다. 다시 시도해주세요.');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoutePress = (path: OdsayPath) => {
    if (!departureStation || !arrivalStation) return;

    const routeName = `${departureStation.stationName} → ${arrivalStation.stationName}`;

    Alert.alert(
      '경로 저장',
      `${path.info.firstStartStation} → ${path.info.lastEndStation}\n소요시간: ${path.info.totalTime}분 | 요금: ${path.info.payment.toLocaleString()}원\n\n이 경로를 저장하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '저장',
          onPress: async () => {
            try {
              await saveRoute(
                routeName,
                toRouteStation(departureStation),
                toRouteStation(arrivalStation),
                path,
              );
              Alert.alert('저장 완료', '경로가 저장되었습니다.', [
                { text: '확인', onPress: () => navigation.goBack() },
              ]);
            } catch {
              Alert.alert('오류', '경로 저장에 실패했습니다.');
            }
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inputSection}>
        <StationSearchInput
          label="출발"
          placeholder="출발지 입력 (역/정류장명)"
          selectedStation={departureStation}
          onSelect={setDepartureStation}
        />

        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Text style={styles.swapIcon}>↕</Text>
        </TouchableOpacity>

        <StationSearchInput
          label="도착"
          placeholder="도착지 입력 (역/정류장명)"
          selectedStation={arrivalStation}
          onSelect={setArrivalStation}
        />
      </View>

      <TouchableOpacity
        style={[styles.searchButton, !canSearch && styles.searchButtonDisabled]}
        onPress={handleSearch}
        disabled={!canSearch || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.searchButtonText}>경로 검색</Text>
        )}
      </TouchableOpacity>

      {loading ? (
        <View style={styles.centerSection}>
          <ActivityIndicator size="large" color="#1A73E8" />
          <Text style={styles.loadingText}>경로를 검색 중입니다...</Text>
        </View>
      ) : routes.length > 0 ? (
        <FlatList
          data={routes}
          keyExtractor={(_, i) => `route-${i}`}
          style={styles.resultList}
          contentContainerStyle={styles.resultContent}
          renderItem={({ item }) => (
            <RouteResultItem path={item} onPress={handleRoutePress} />
          )}
        />
      ) : (
        <View style={styles.centerSection}>
          <Text style={styles.placeholderText}>
            {searched
              ? '검색 결과가 없습니다'
              : '출발지와 도착지를 선택하고 검색하세요'}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  inputSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  swapButton: {
    alignSelf: 'center',
    padding: 4,
  },
  swapIcon: {
    fontSize: 20,
    color: '#999',
  },
  searchButton: {
    backgroundColor: '#1A73E8',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultList: {
    flex: 1,
    marginTop: 16,
  },
  resultContent: {
    paddingBottom: 24,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },
});
