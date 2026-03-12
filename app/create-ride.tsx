import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/stores/authStore';
import { useRidesStore } from '@/stores/ridesStore';

export default function CreateRideScreen() {
  const router = useRouter();
  const cs = useColorScheme();
  const c = Colors[cs];

  const user = useAuthStore((s) => s.user);
  const ridesError = useRidesStore((s) => s.error);
  const isLoading = useRidesStore((s) => s.isLoading);
  const createRide = useRidesStore((s) => s.createRide);

  const [title, setTitle] = useState('');
  const [startDateTime, setStartDateTime] = useState<Date | null>(new Date());
  const [startLocationName, setStartLocationName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [stops, setStops] = useState<string[]>([]);
  const [finalStop, setFinalStop] = useState('');
  const [inviteCode] = useState(
    Math.random().toString(36).slice(2, 8).toUpperCase(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!user) {
      setLocalError('You need to be logged in to create a ride.');
      return;
    }
    if (!title.trim()) {
      setLocalError('Please give your ride a title.');
      return;
    }
    if (!startLocationName.trim()) {
      setLocalError('Please enter a start location.');
      return;
    }

    setLocalError(null);
    await createRide(user, {
      title,
      startTime: startDateTime,
      startLocationName,
      isPublic,
      stops: stops.map((s) => s.trim()).filter(Boolean),
      finalStop,
      inviteCode,
    });

    if (!useRidesStore.getState().error) {
      router.replace('/(tabs)/rides');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ backgroundColor: c.background }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: c.text }]}>Create Ride</Text>
        <Text style={[styles.subtitle, { color: c.tabIconDefault }]}>
          Basic details for your group ride. You can refine routes later.
        </Text>

        {(localError || ridesError) && (
          <Text style={styles.errorText}>{localError ?? ridesError}</Text>
        )}

        <Text style={[styles.label, { color: c.text }]}>Ride title</Text>
        <TextInput
          style={[styles.input, { borderColor: c.border, color: c.text }]}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: c.text }]}>Start date</Text>
        <Pressable
          style={({ pressed }) => [
            styles.input,
            { borderColor: c.border, backgroundColor: c.card },
            pressed && styles.pressed,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: c.text }}>
            {startDateTime
              ? startDateTime.toLocaleDateString()
              : 'Select date'}
          </Text>
        </Pressable>

        <Text style={[styles.label, { color: c.text }]}>Start time</Text>
        <Pressable
          style={({ pressed }) => [
            styles.input,
            { borderColor: c.border, backgroundColor: c.card },
            pressed && styles.pressed,
          ]}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={{ color: c.text }}>
            {startDateTime
              ? startDateTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Select time'}
          </Text>
        </Pressable>

        <Text style={[styles.label, { color: c.text }]}>Start location</Text>
        <TextInput
          style={[styles.input, { borderColor: c.border, color: c.text }]}
          value={startLocationName}
          onChangeText={setStartLocationName}
        />

        <Text style={[styles.label, { color: c.text }]}>Stops (optional)</Text>
        {stops.map((s, idx) => (
          <TextInput
            key={idx}
            style={[styles.input, { borderColor: c.border, color: c.text }]}
            value={s}
            onChangeText={(v) =>
              setStops((prev) => prev.map((p, i) => (i === idx ? v : p)))
            }
          />
        ))}
        <Pressable
          style={({ pressed }) => [
            styles.addStopButton,
            { borderColor: c.border },
            pressed && styles.pressed,
          ]}
          onPress={() => setStops((prev) => [...prev, ''])}
        >
          <Text style={[styles.addStopText, { color: c.text }]}>+ Add stop</Text>
        </Pressable>

        <Text style={[styles.label, { color: c.text }]}>Final stop</Text>
        <TextInput
          style={[styles.input, { borderColor: c.border, color: c.text }]}
          value={finalStop}
          onChangeText={setFinalStop}
        />

        <Text style={[styles.label, { color: c.text }]}>Visibility</Text>
        <View style={styles.row}>
          <Pressable
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: isPublic ? c.tint : c.chip,
                borderColor: c.chipBorder,
              },
              pressed && styles.pressed,
            ]}
            onPress={() => setIsPublic(true)}
          >
            <Text
              style={[
                styles.chipText,
                { color: isPublic ? '#fff' : c.text },
              ]}
            >
              Public
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: !isPublic ? c.tint : c.chip,
                borderColor: c.chipBorder,
              },
              pressed && styles.pressed,
            ]}
            onPress={() => setIsPublic(false)}
          >
            <Text
              style={[
                styles.chipText,
                { color: !isPublic ? '#fff' : c.text },
              ]}
            >
              Private
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.label, { color: c.text }]}>Invite code</Text>
        <View
          style={[
            styles.input,
            {
              borderColor: c.border,
              backgroundColor: c.card,
              justifyContent: 'center',
            },
          ]}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: c.text }}>
            {inviteCode}
          </Text>
        </View>

        <View style={styles.buttonsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: c.border },
              pressed && styles.pressed,
            ]}
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <Text style={[styles.secondaryText, { color: c.text }]}>Cancel</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: c.tint },
              pressed && styles.pressed,
              isLoading && styles.disabled,
            ]}
            onPress={handleCreate}
            disabled={isLoading}
          >
            <Text style={styles.primaryText}>
              {isLoading ? 'Creating…' : 'Create Ride'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={startDateTime ?? new Date()}
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) {
              setStartDateTime((prev) => {
                const base = prev ?? new Date();
                const merged = new Date(base);
                merged.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                return merged;
              });
            }
          }}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={startDateTime ?? new Date()}
          onChange={(_, date) => {
            setShowTimePicker(false);
            if (date) {
              setStartDateTime((prev) => {
                const base = prev ?? new Date();
                const merged = new Date(base);
                merged.setHours(date.getHours(), date.getMinutes(), 0, 0);
                return merged;
              });
            }
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  addStopButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
  },
  addStopText: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
});
