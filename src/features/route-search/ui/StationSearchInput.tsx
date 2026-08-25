import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { searchStation } from '../api/searchStation';
import type { OdsayStation } from '../../../entities/route/model/types';

interface Props {
  label: string;
  placeholder: string;
  selectedStation: OdsayStation | null;
  onSelect: (station: OdsayStation) => void;
}

export default function StationSearchInput({
  label,
  placeholder,
  selectedStation,
  onSelect,
}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OdsayStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);

    if (text.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const stations = await searchStation(text.trim());
      setResults(stations);
      setShowResults(stations.length > 0);
    } catch {
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = (station: OdsayStation) => {
    onSelect(station);
    setQuery(station.stationName);
    setShowResults(false);
    setResults([]);
  };

  const getStationTypeLabel = (type: number) => {
    return type === 2 ? '[지하철]' : '[버스]';
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={selectedStation ? selectedStation.stationName : query}
          onChangeText={(text) => {
            if (selectedStation) {
              onSelect(null as unknown as OdsayStation);
            }
            handleSearch(text);
          }}
          onFocus={() => {
            if (selectedStation) {
              setQuery(selectedStation.stationName);
              onSelect(null as unknown as OdsayStation);
            }
          }}
          returnKeyType="search"
        />
        {loading && <ActivityIndicator size="small" color="#1A73E8" />}
      </View>

      {showResults && (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.stationID}-${item.type}`}
          style={styles.resultList}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.stationName}>
                <Text style={styles.stationType}>
                  {getStationTypeLabel(item.type)}{' '}
                </Text>
                {item.stationName}
              </Text>
              {item.laneName && (
                <Text style={styles.laneName}>{item.laneName}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A73E8',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    color: '#333',
  },
  resultList: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginLeft: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stationName: {
    fontSize: 15,
    color: '#333',
  },
  stationType: {
    fontSize: 12,
    color: '#1A73E8',
    fontWeight: '600',
  },
  laneName: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});
