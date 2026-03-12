import { ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/stores/authStore';

const STATS = [
  { label: 'Total Distance', value: '2,400 km' },
  { label: 'Longest Ride', value: '420 km' },
  { label: 'Total Rides', value: '18' },
];

const BADGES = [
  { emoji: '🏁', label: 'First Ride' },
  { emoji: '🛣', label: '1000km Rider' },
  { emoji: '🌅', label: 'Weekend Explorer' },
  { emoji: '🌙', label: 'Night Rider' },
];

const SETTINGS = [
  { label: 'Account', icon: '👤' },
  { label: 'Notifications', icon: '🔔' },
  { label: 'Privacy', icon: '🔒' },
  { label: 'Help', icon: '❓' },
];

export default function ProfileScreen() {
  const cs = useColorScheme();
  const c = Colors[cs];
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.container}
    >
      {/* ── Profile Header ── */}
      <View style={styles.profileHeader}>
        <View style={[styles.avatarLarge, { backgroundColor: c.tint }]}>
          <Text style={styles.avatarLargeText}>
            {(user?.name ?? 'R')[0].toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.userName, { color: c.text }]}>
          {user?.name ?? 'Rider'}
        </Text>
        <Text style={[styles.userEmail, { color: c.tabIconDefault }]}>
          {user?.email ?? ''}
        </Text>
        <View style={[styles.levelBadge, { backgroundColor: c.chip, borderColor: c.chipBorder }]}>
          <Text style={[styles.levelText, { color: c.tint }]}>
            🏍 Touring Rider
          </Text>
        </View>
        <Text style={[styles.profileMeta, { color: c.tabIconDefault }]}>
          2 Bikes · 18 Rides
        </Text>
      </View>

      {/* ── Ride Stats ── */}
      <Text style={[styles.sectionTitle, { color: c.text }]}>Ride Stats</Text>
      <View style={styles.statsRow}>
        {STATS.map((s) => (
          <View
            key={s.label}
            style={[styles.statCard, { backgroundColor: c.card, borderColor: c.border }]}
          >
            <Text style={[styles.statValue, { color: c.tint }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: c.tabIconDefault }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Achievements ── */}
      <Text style={[styles.sectionTitle, { color: c.text }]}>Achievements</Text>
      <View style={styles.badgesRow}>
        {BADGES.map((b) => (
          <View
            key={b.label}
            style={[styles.badgeCard, { backgroundColor: c.card, borderColor: c.border }]}
          >
            <Text style={styles.badgeEmoji}>{b.emoji}</Text>
            <Text style={[styles.badgeLabel, { color: c.text }]}>{b.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Settings ── */}
      <Text style={[styles.sectionTitle, { color: c.text }]}>Settings</Text>
      <View style={[styles.settingsCard, { backgroundColor: c.card, borderColor: c.border }]}>
        {SETTINGS.map((s, i) => (
          <Pressable
            key={s.label}
            style={({ pressed }) => [
              styles.settingsRow,
              i < SETTINGS.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={{ fontSize: 18 }}>{s.icon}</Text>
            <Text style={[styles.settingsLabel, { color: c.text }]}>{s.label}</Text>
            <Text style={[styles.settingsArrow, { color: c.tabIconDefault }]}>›</Text>
          </Pressable>
        ))}
      </View>

      {/* ── Logout ── */}
      <Pressable
        style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 12 },
  profileHeader: { alignItems: 'center', marginBottom: 28 },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarLargeText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  userName: { fontSize: 22, fontWeight: '800' },
  userEmail: { fontSize: 14, marginTop: 4 },
  levelBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelText: { fontSize: 13, fontWeight: '600' },
  profileMeta: { fontSize: 13, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 4, textAlign: 'center' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  badgeCard: {
    width: '22%',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  badgeEmoji: { fontSize: 24, marginBottom: 6 },
  badgeLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  settingsCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  settingsLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  settingsArrow: { fontSize: 22, fontWeight: '300' },
  pressed: { opacity: 0.7 },
  logoutBtn: {
    backgroundColor: '#F63049',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
