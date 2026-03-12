import { useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/stores/authStore';
import { useRidesStore } from '@/stores/ridesStore';

export default function HomeScreen() {
  const router = useRouter();
  const cs = useColorScheme();
  const c = Colors[cs];
  const user = useAuthStore((s) => s.user);
  const { upcoming, isLoading, error, refreshForUser } = useRidesStore();

  useEffect(() => {
    if (user) {
      refreshForUser(user);
    }
  }, [user]);

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.container}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>
            👋 Hello, {user?.name ?? 'Rider'}
          </Text>
          <Text style={[styles.subtitle, { color: c.tabIconDefault }]}>
            Ready to ride today?
          </Text>
        </View>
        <Pressable
          style={[styles.avatarCircle, { backgroundColor: c.tint }]}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text style={styles.avatarText}>
            {(user?.name ?? 'R')[0].toUpperCase()}
          </Text>
        </Pressable>
      </View>

      {/* ── Quick Actions ── */}
      <Text style={[styles.sectionTitle, { color: c.text }]}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {[
          { label: 'Start Ride', icon: '🏍', onPress: () => router.push('/(tabs)/map') },
          { label: 'Create Ride', icon: '➕', onPress: () => router.push('/create-ride') },
          { label: 'Join Ride', icon: '🤝', onPress: () => router.push('/(tabs)/rides') },
          { label: 'Open Map', icon: '🗺', onPress: () => router.push('/(tabs)/map') },
        ].map((a) => (
          <Pressable
            key={a.label}
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: c.card, borderColor: c.border },
              pressed && styles.pressed,
            ]}
            onPress={a.onPress}
          >
            <Text style={styles.actionIcon}>{a.icon}</Text>
            <Text style={[styles.actionLabel, { color: c.text }]}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* ── Active Ride ── */}
      <Text style={[styles.sectionTitle, { color: c.text }]}>Active Ride</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.emptyText, { color: c.tabIconDefault }]}>
          No active rides
        </Text>
        <Text style={[styles.emptyHint, { color: c.tabIconDefault }]}>
          Start a ride or join one
        </Text>
      </View>

      {/* ── Upcoming Rides ── */}
      <Text style={[styles.sectionTitle, { color: c.text }]}>Upcoming Rides</Text>
      {error && (
        <Text style={[styles.rideMeta, { color: '#dc2626' }]}>{error}</Text>
      )}

      {isLoading && upcoming.length === 0 ? (
        <Text style={[styles.rideMeta, { color: c.tabIconDefault }]}>
          Loading your rides…
        </Text>
      ) : upcoming.length === 0 ? (
        <Pressable
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: c.card, borderColor: c.border },
            pressed && styles.pressed,
          ]}
          onPress={() => router.push('/create-ride')}
        >
          <Text style={[styles.emptyText, { color: c.text }]}>
            No upcoming rides
          </Text>
          <Text style={[styles.emptyHint, { color: c.tabIconDefault }]}>
            Tap to create your first group ride.
          </Text>
        </Pressable>
      ) : (
        upcoming.slice(0, 2).map((r, idx) => (
          <Pressable
            key={r.id}
            style={({ pressed }) => [
              styles.rideCard,
              { backgroundColor: c.card, borderColor: c.border },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push('/(tabs)/rides')}
          >
            <View style={[styles.rideBadge, { backgroundColor: c.tint }]}>
              <Text style={styles.rideBadgeText}>{idx === 0 ? '🏍' : '🌙'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rideTitle, { color: c.text }]}>
                {r.title}
              </Text>
              <Text style={[styles.rideMeta, { color: c.tabIconDefault }]}>
                {r.startTime
                  ? r.startTime.toLocaleString()
                  : 'Start time to be announced'}{' '}
                · {r.riderIds.length} Riders
              </Text>
            </View>
          </Pressable>
        ))
      )}

      {/* ── Recent Activity ── */}
      <Text style={[styles.sectionTitle, { color: c.text }]}>Recent Activity</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.activityItem, { color: c.text }]}>
          🏁 Rahul completed a 240 km ride
        </Text>
        <View style={[styles.activityDivider, { backgroundColor: c.border }]} />
        <Text style={[styles.activityItem, { color: c.text }]}>
          📍 Arjun created a ride near you
        </Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 4 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    width: '47%',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionLabel: { fontSize: 14, fontWeight: '600' },
  pressed: { opacity: 0.8 },
  card: {
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  emptyText: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
  emptyHint: { fontSize: 13, textAlign: 'center', marginTop: 4 },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 14,
  },
  rideBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideBadgeText: { fontSize: 20 },
  rideTitle: { fontSize: 16, fontWeight: '700' },
  rideMeta: { fontSize: 13, marginTop: 3 },
  activityItem: { fontSize: 14, paddingVertical: 8 },
  activityDivider: { height: 1 },
});
