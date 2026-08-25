import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function RouteSearchScreen() {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  const canSearch = departure.trim().length > 0 && arrival.trim().length > 0;

  const handleSwap = () => {
    setDeparture(arrival);
    setArrival(departure);
  };

  const handleSearch = () => {
    // Phase 2.2에서 ODsay API 연동 예정
    if (!canSearch) return;
    console.log('경로 탐색:', { departure, arrival });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>출발</Text>
          <TextInput
            style={styles.input}
            placeholder="출발지 입력 (역/정류장명)"
            placeholderTextColor="#999"
            value={departure}
            onChangeText={setDeparture}
            returnKeyType="next"
          />
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Text style={styles.swapIcon}>↕</Text>
        </TouchableOpacity>

        <View style={styles.inputRow}>
          <Text style={styles.label}>도착</Text>
          <TextInput
            style={styles.input}
            placeholder="도착지 입력 (역/정류장명)"
            placeholderTextColor="#999"
            value={arrival}
            onChangeText={setArrival}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.searchButton, !canSearch && styles.searchButtonDisabled]}
        onPress={handleSearch}
        disabled={!canSearch}
      >
        <Text style={styles.searchButtonText}>경로 검색</Text>
      </TouchableOpacity>

      <View style={styles.resultSection}>
        <Text style={styles.resultPlaceholder}>
          출발지와 도착지를 입력하고 검색하세요
        </Text>
      </View>
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
  resultSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  resultPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
});
