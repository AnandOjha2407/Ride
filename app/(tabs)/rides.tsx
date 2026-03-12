import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/stores/authStore';
import { useRidesStore } from '@/stores/ridesStore';

type Tab = 'upcoming' | 'discover' | 'past';

export default function RidesScreen() {
  const router = useRouter();
  const cs = useColorScheme();
  const c = Colors[cs];
  const user = useAuthStore((s) => s.user);
  const { upcoming, discover, isLoading, error, refreshForUser, joinRide } = useRidesStore();
  const [tab, setTab] = useState<Tab>('upcoming');

  useEffect(() => {
    if (user) {
      refreshForUser(user);
    }
  }, [user]);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* ── Tab bar ── */}
      <View style={[styles.tabBar, { borderBottomColor: c.border }]}>
        {(['upcoming', 'discover', 'past'] as Tab[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[
              styles.tab,
              tab === t && { borderBottomColor: c.tint, borderBottomWidth: 2 },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: tab === t ? c.tint : c.tabIconDefault },
              ]}
            >
              {t === 'upcoming' ? 'Upcoming' : t === 'discover' ? 'Discover' : 'Past'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* ── Upcoming ── */}
        {tab === 'upcoming' && (
          <>
            {isLoading && upcoming.length === 0 ? (
              <Text style={[styles.cardMeta, { color: c.tabIconDefault }]}>
                Loading your rides…
              </Text>
            ) : upcoming.length === 0 ? (
              <Text style={[styles.cardMeta, { color: c.tabIconDefault }]}>
                No upcoming rides yet. Create one!
              </Text>
            ) : (
              upcoming.map((r) => (
                <Pressable
                  key={r.id}
                  style={({ pressed }) => [
                    styles.card,
                    { backgroundColor: c.card, borderColor: c.border },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.cardTitle, { color: c.text }]}>{r.title}</Text>
                  <Text style={[styles.cardMeta, { color: c.tabIconDefault }]}>
                    Leader: {r.creatorName} · {r.riderIds.length} Riders
                  </Text>
                  {r.startTime && (
                    <Text style={[styles.cardWhen, { color: c.tint }]}>
                      {r.startTime.toLocaleString()}
                    </Text>
                  )}
                  {!r.startTime && (
                    <Text style={[styles.cardWhen, { color: c.tint }]}>
                      Start time to be announced
                    </Text>
                  )}
                </Pressable>
              ))
            )}
          </>
        )}

        {/* ── Discover ── */}
        {tab === 'discover' && (
          <>
            <View style={[styles.filterRow, { borderColor: c.border }]}>
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((f) => (
                <Pressable
                  key={f}
                  style={[styles.filterChip, { backgroundColor: c.chip, borderColor: c.chipBorder }]}
                >
                  <Text style={[styles.filterText, { color: c.text }]}>{f}</Text>
                </Pressable>
              ))}
            </View>
            {isLoading && discover.length === 0 ? (
              <Text style={[styles.cardMeta, { color: c.tabIconDefault }]}>
                Loading public rides…
              </Text>
            ) : discover.length === 0 ? (
              <Text style={[styles.cardMeta, { color: c.tabIconDefault }]}>
                No public rides available right now.
              </Text>
            ) : (
              discover.map((r) => (
                <View
                  key={r.id}
                  style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}
                >
                  <Text style={[styles.cardTitle, { color: c.text }]}>{r.title}</Text>
                  <Text style={[styles.cardMeta, { color: c.tabIconDefault }]}>
                    {r.riderIds.length} Riders
                  </Text>
                  {r.startTime && (
                    <Text style={[styles.cardWhen, { color: c.tint }]}>
                      {r.startTime.toLocaleString()}
                    </Text>
                  )}
                  <Pressable
                    style={({ pressed }) => [
                      styles.joinBtn,
                      { backgroundColor: c.tint },
                      pressed && styles.pressed,
                    ]}
                    onPress={() => user && joinRide(r.id, user)}
                    disabled={isLoading || !user}
                  >
                    <Text style={styles.joinBtnText}>Join Ride</Text>
                  </Pressable>
                </View>
              ))
            )}
          </>
        )}

        {/* ── Past ── */}
        {tab === 'past' && (
          <Text style={[styles.cardMeta, { color: c.tabIconDefault }]}>
            Past rides history will appear here later.
          </Text>
        )}
      </ScrollView>

      {/* ── FAB ── */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: c.tint },
          pressed && styles.pressed,
        ]}
        onPress={() => router.push('/create-ride')}
      >
        <Text style={styles.fabText}>+ Create Ride</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabText: { fontSize: 15, fontWeight: '600' },
  list: { padding: 20, paddingBottom: 90 },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardMeta: { fontSize: 13, marginTop: 4 },
  cardWhen: { fontSize: 13, fontWeight: '600', marginTop: 6 },
  pressed: { opacity: 0.8 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontWeight: '500' },
  joinBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 10,
  },
  joinBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  pastActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  pastBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  pastBtnText: { fontSize: 13, fontWeight: '500' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
