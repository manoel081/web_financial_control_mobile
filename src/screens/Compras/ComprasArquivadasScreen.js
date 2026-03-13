import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

function formatCurrency(value) {
  return 'R$ ' + parseFloat(value || 0).toFixed(2).replace('.', ',');
}

export default function ComprasArquivadasScreen({ navigation }) {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadArquivadas = useCallback(async () => {
    try {
      // TODO: integrar com comprasService.listArquivadas
      setCompras([]);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadArquivadas);
    return unsub;
  }, [navigation, loadArquivadas]);

  async function onRefresh() { setRefreshing(true); await loadArquivadas(); setRefreshing(false); }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={compras}
        keyExtractor={item => String(item.cd_compra)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.nome_item}</Text>
              <Text style={styles.cardDate}>Quitada em {item.dt_quitacao}</Text>
              <Text style={styles.cardDetail}>{item.qtd_parcelas} parcelas · {formatCurrency(item.valor_total)}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.statusText}>Quitada</Text>
            </View>
          </View>
        )}
        contentContainerStyle={compras.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="archive-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>Nenhuma compra arquivada</Text>
            <Text style={styles.emptySubText}>Compras quitadas aparecerão aqui</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: SPACING.md, marginTop: SPACING.sm, borderRadius: RADIUS.md, padding: SPACING.md, elevation: 1, opacity: 0.85 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: SPACING.md },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: FONT.md, fontWeight: '600', color: COLORS.textPrimary },
  cardDate: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: 2 },
  cardDetail: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: { alignItems: 'center' },
  statusText: { fontSize: 10, color: COLORS.success, fontWeight: '600', marginTop: 2 },
  emptyContainer: { flexGrow: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: FONT.lg, color: COLORS.textSecondary, marginTop: SPACING.md, fontWeight: '600' },
  emptySubText: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: SPACING.sm },
});
