import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface Bike {
  id: string;
  brand: string;
  model: string;
  year: string;
  cc: string;
  mileage: string;
}

const INITIAL_BIKES: Bike[] = [
  { id: '1', brand: 'Royal Enfield', model: 'Himalayan', year: '2023', cc: '411', mileage: '30 km/l' },
  { id: '2', brand: 'KTM', model: 'Duke 390', year: '2024', cc: '373', mileage: '28 km/l' },
];

export default function GarageScreen() {
  const cs = useColorScheme();
  const c = Colors[cs];
  const [bikes, setBikes] = useState<Bike[]>(INITIAL_BIKES);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ brand: '', model: '', year: '', cc: '' });

  const addBike = () => {
    if (!form.brand.trim() || !form.model.trim()) return;
    setBikes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: form.year.trim() || '—',
        cc: form.cc.trim() || '—',
        mileage: '—',
      },
    ]);
    setForm({ brand: '', model: '', year: '', cc: '' });
    setShowAdd(false);
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={[styles.heading, { color: c.text }]}>My Garage</Text>
        <Text style={[styles.subheading, { color: c.tabIconDefault }]}>
          {bikes.length} motorcycle{bikes.length !== 1 ? 's' : ''}
        </Text>

        {bikes.map((b) => (
          <Pressable
            key={b.id}
            style={({ pressed }) => [
              styles.bikeCard,
              { backgroundColor: c.card, borderColor: c.border },
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.bikeIcon, { backgroundColor: c.tint }]}>
              <Text style={styles.bikeEmoji}>🏍</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.bikeName, { color: c.text }]}>
                {b.brand} {b.model}
              </Text>
              <Text style={[styles.bikeMeta, { color: c.tabIconDefault }]}>
                {b.cc}cc · {b.year} · {b.mileage}
              </Text>
            </View>
          </Pressable>
        ))}

        {/* ── Maintenance placeholder ── */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>Maintenance</Text>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.emptyText, { color: c.tabIconDefault }]}>
            No service records yet
          </Text>
          <Text style={[styles.emptyHint, { color: c.tabIconDefault }]}>
            Tap a bike to add service history
          </Text>
        </View>
      </ScrollView>

      {/* ── Add Bike FAB ── */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: c.tint },
          pressed && styles.pressed,
        ]}
        onPress={() => setShowAdd(true)}
      >
        <Text style={styles.fabText}>+ Add Motorcycle</Text>
      </Pressable>

      {/* ── Add Bike Modal ── */}
      <Modal visible={showAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: c.background, borderColor: c.border }]}>
            <Text style={[styles.modalTitle, { color: c.text }]}>Add Motorcycle</Text>

            {(['brand', 'model', 'year', 'cc'] as const).map((f) => (
              <TextInput
                key={f}
                style={[styles.input, { borderColor: c.border, color: c.text }]}
                placeholder={f === 'cc' ? 'Engine CC' : f.charAt(0).toUpperCase() + f.slice(1)}
                placeholderTextColor={c.tabIconDefault}
                value={form[f]}
                onChangeText={(v) => setForm((p) => ({ ...p, [f]: v }))}
                keyboardType={f === 'year' || f === 'cc' ? 'numeric' : 'default'}
              />
            ))}

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, { borderColor: c.border, borderWidth: 1 }]}
                onPress={() => setShowAdd(false)}
              >
                <Text style={[styles.modalBtnText, { color: c.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: c.tint }]}
                onPress={addBike}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { padding: 20, paddingBottom: 90 },
  heading: { fontSize: 24, fontWeight: '800' },
  subheading: { fontSize: 14, marginTop: 4, marginBottom: 20 },
  bikeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 14,
  },
  bikeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bikeEmoji: { fontSize: 22 },
  bikeName: { fontSize: 16, fontWeight: '700' },
  bikeMeta: { fontSize: 13, marginTop: 3 },
  pressed: { opacity: 0.8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  card: {
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
  },
  emptyText: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
  emptyHint: { fontSize: 13, textAlign: 'center', marginTop: 4 },
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
  },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnText: { fontSize: 16, fontWeight: '600' },
});
