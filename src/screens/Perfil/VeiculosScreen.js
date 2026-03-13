import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

function formatCurrency(value) {
  return 'R$ ' + parseFloat(value || 0).toFixed(2).replace('.', ',');
}

export default function VeiculosScreen({ navigation }) {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadVeiculos = useCallback(async () => {
    try {
      // TODO: integrar com veiculosService.listVeiculos
      setVeiculos([]);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadVeiculos);
    return unsub;
  }, [navigation, loadVeiculos]);

  async function onRefresh() { setRefreshing(true); await loadVeiculos(); setRefreshing(false); }

  function handleDelete(id) {
    Alert.alert('Remover Veículo', 'Deseja remover este veículo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => {} },
    ]);
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={veiculos}
        keyExtractor={item => String(item.cd_veiculo)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="car" size={28} color={COLORS.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.veiculo_modelo}</Text>
              <Text style={styles.cardSub}>Consumo: {item.consumo_cidade} km/L (cidade)</Text>
              <View style={styles.costsRow}>
                <View style={styles.costBadge}>
                  <Text style={styles.costLabel}>Custo/mês</Text>
                  <Text style={styles.costValue}>{formatCurrency(item.custo_mensal)}</Text>
                </View>
                <View style={styles.costBadge}>
                  <Text style={styles.costLabel}>Custo/dia</Text>
                  <Text style={styles.costValue}>{formatCurrency(item.custo_diario)}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.cd_veiculo)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={veiculos.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>Nenhum veículo cadastrado</Text>
            <Text style={styles.emptySubText}>Toque no + para adicionar</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddVeiculo')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.surface, marginHorizontal: SPACING.md, marginTop: SPACING.sm, borderRadius: RADIUS.md, padding: SPACING.md, elevation: 2 },
  cardIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  cardSub: { fontSize: FONT.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  costsRow: { flexDirection: 'row', gap: SPACING.sm },
  costBadge: { backgroundColor: COLORS.background, borderRadius: RADIUS.sm, padding: SPACING.sm },
  costLabel: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },
  costValue: { fontSize: FONT.sm, fontWeight: 'bold', color: COLORS.primary },
  deleteBtn: { padding: SPACING.sm },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  emptyContainer: { flexGrow: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: FONT.lg, color: COLORS.textSecondary, marginTop: SPACING.md, fontWeight: '600' },
  emptySubText: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: SPACING.sm },
});
