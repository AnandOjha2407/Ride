import { useState } from 'react';
import { StyleSheet, Pressable, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type Mode = 'current' | 'saved' | 'nearby' | 'explore';

const SAVED_ROUTES = [
  { id: '1', name: 'Nandi Hills Route', distance: '85 km' },
  { id: '2', name: 'Airport Loop', distance: '42 km' },
  { id: '3', name: 'Coastal Ride', distance: '220 km' },
];

export default function MapScreen() {
  const cs = useColorScheme();
  const c = Colors[cs];
  const [mode, setMode] = useState<Mode>('explore');
  const [rideActive, setRideActive] = useState(false);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* ── Mode Selector ── */}
      <View style={[styles.modeBar, { backgroundColor: c.background, borderBottomColor: c.border }]}>
        {([
          ['current', 'Current Ride'],
          ['saved', 'Saved Routes'],
          ['nearby', 'Nearby Rides'],
          ['explore', 'Explore'],
        ] as [Mode, string][]).map(([m, label]) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            style={[
              styles.modeTab,
              mode === m && { backgroundColor: c.tint },
            ]}
          >
            <Text
              style={[
                styles.modeText,
                { color: mode === m ? '#fff' : c.tabIconDefault },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── Map Placeholder ── */}
      <View style={[styles.mapArea, { backgroundColor: cs === 'dark' ? '#292524' : '#e7e5e4' }]}>
        <Text style={[styles.mapPlaceholder, { color: c.tabIconDefault }]}>
          🗺 Map View
        </Text>
        <Text style={[styles.mapHint, { color: c.tabIconDefault }]}>
          {mode === 'current' && (rideActive ? 'Following route...' : 'No active ride')}
          {mode === 'saved' && 'Select a saved route below'}
          {mode === 'nearby' && 'Showing nearby rides on map'}
          {mode === 'explore' && 'Explore scenic roads, cafes & fuel stations'}
        </Text>
      </View>

      {/* ── Saved Routes List ── */}
      {mode === 'saved' && (
        <View style={[styles.bottomPanel, { backgroundColor: c.background, borderTopColor: c.border }]}>
          {SAVED_ROUTES.map((r) => (
            <View
              key={r.id}
              style={[styles.routeRow, { borderBottomColor: c.border }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.routeName, { color: c.text }]}>{r.name}</Text>
                <Text style={[styles.routeDist, { color: c.tabIconDefault }]}>{r.distance}</Text>
              </View>
              <Pressable style={[styles.routeBtn, { backgroundColor: c.tint }]}>
                <Text style={styles.routeBtnText}>Start</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* ── Ride Controls (shown when ride active) ── */}
      {mode === 'current' && (
        <View style={[styles.controls, { backgroundColor: c.background, borderTopColor: c.border }]}>
          {!rideActive ? (
            <Pressable
              style={({ pressed }) => [
                styles.ctrlBtn,
                { backgroundColor: c.tint },
                pressed && styles.pressed,
              ]}
              onPress={() => setRideActive(true)}
            >
              <Text style={styles.ctrlBtnText}>Start Ride</Text>
            </Pressable>
          ) : (
            <>
              <Pressable style={[styles.ctrlBtn, { backgroundColor: c.tint }]}>
                <Text style={styles.ctrlBtnText}>Follow Leader</Text>
              </Pressable>
              <Pressable style={[styles.ctrlBtn, { backgroundColor: '#8A244B' }]}>
                <Text style={styles.ctrlBtnText}>Regroup</Text>
              </Pressable>
              <Pressable
                style={[styles.ctrlBtn, { backgroundColor: '#F63049' }]}
                onPress={() => setRideActive(false)}
              >
                <Text style={styles.ctrlBtnText}>End Ride</Text>
              </Pressable>
            </>
          )}
        </View>
      )}

      {/* ── Floating Actions ── */}
      <View style={styles.floatingActions}>
        <Pressable style={[styles.floatBtn, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={{ fontSize: 16 }}>📍</Text>
        </Pressable>
        <Pressable style={[styles.floatBtn, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={{ fontSize: 16 }}>⚠️</Text>
        </Pressable>
        <Pressable style={[styles.floatBtn, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={{ fontSize: 16 }}>📌</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  modeBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderBottomWidth: 1,
  },
  modeTab: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  modeText: { fontSize: 12, fontWeight: '600' },
  mapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholder: { fontSize: 40 },
  mapHint: { fontSize: 14, marginTop: 10, textAlign: 'center', paddingHorizontal: 30 },
  bottomPanel: { borderTopWidth: 1, maxHeight: 220, paddingHorizontal: 20, paddingTop: 8 },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  routeName: { fontSize: 15, fontWeight: '600' },
  routeDist: { fontSize: 13, marginTop: 2 },
  routeBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  routeBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  controls: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
  },
  ctrlBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  ctrlBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.8 },
  floatingActions: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    gap: 10,
  },
  floatBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
