import { StyleSheet, Text, View, Switch, ScrollView } from 'react-native';
import { useSettingsStore } from '../../entities/user/model/useSettingsStore';

const WALKING_SPEEDS = [
  { label: '느리게 (0.8 m/s)', value: 0.8 },
  { label: '보통 (1.2 m/s)', value: 1.2 },
  { label: '빠르게 (1.6 m/s)', value: 1.6 },
];

const ALERT_STOPS = [1, 2, 3, 4, 5];

export default function SettingsScreen() {
  const {
    walkingSpeed,
    alertStopsBefore,
    soundEnabled,
    vibrationEnabled,
    setWalkingSpeed,
    setAlertStopsBefore,
    setSoundEnabled,
    setVibrationEnabled,
  } = useSettingsStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>보행 속도</Text>
      <View style={styles.card}>
        {WALKING_SPEEDS.map((option) => (
          <OptionRow
            key={option.value}
            label={option.label}
            selected={walkingSpeed === option.value}
            onPress={() => setWalkingSpeed(option.value)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>하차 알림 타이밍</Text>
      <View style={styles.card}>
        {ALERT_STOPS.map((count) => (
          <OptionRow
            key={count}
            label={`${count}정거장 전`}
            selected={alertStopsBefore === count}
            onPress={() => setAlertStopsBefore(count)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>알림</Text>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>알림 소리</Text>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ true: '#1A73E8' }}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>진동</Text>
          <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ true: '#1A73E8' }}
          />
        </View>
      </View>

      <Text style={styles.versionText}>Getting Off v1.0.0</Text>
    </ScrollView>
  );
}

function OptionRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.optionRow}>
      <Text
        style={[styles.optionLabel, selected && styles.optionLabelSelected]}
        onPress={onPress}
      >
        {label}
      </Text>
      {selected && <Text style={styles.checkMark}>v</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionLabel: {
    fontSize: 15,
    color: '#333',
  },
  optionLabelSelected: {
    color: '#1A73E8',
    fontWeight: '600',
  },
  checkMark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A73E8',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  switchLabel: {
    fontSize: 15,
    color: '#333',
  },
  versionText: {
    textAlign: 'center',
    color: '#CCC',
    fontSize: 12,
    marginTop: 32,
  },
});
