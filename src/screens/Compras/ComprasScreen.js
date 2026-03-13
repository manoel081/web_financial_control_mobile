import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, RefreshControl,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

function formatCurrency(value) {
  return 'R$ ' + parseFloat(value || 0).toFixed(2).replace('.', ',');
}

function CompraCard({ item, onPagar, onArquivar }) {
  const parcPagas = item.parcelas_pagas || 0;
  const totalParc = item.qtd_parcelas || 1;
  const progress = parcPagas / totalParc;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardTitle}>{item.nome_item}</Text>
          <View style={styles.parcBadge}>
            <Text style={styles.parcBadgeText}>{parcPagas}/{totalParc} pagas</Text>
          </View>
        </View>
        <Text style={styles.cardValue}>{formatCurrency(item.valor_parcela)}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.cardInfo}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.cardDate}>Vence {item.dt_vencimento}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.btnPagar} onPress={() => onPagar(item.cd_parcela)}>
            <Ionicons name="checkmark" size={14} color="#fff" />
            <Text style={styles.btnPagarText}>Pagar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnArquivar} onPress={() => onArquivar(item.cd_compra)}>
            <Ionicons name="archive-outline" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ComprasScreen({ navigation }) {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCompras = useCallback(async () => {
    try {
      // TODO: integrar com comprasService.listCompras
      setCompras([]);
    } catch {
      Alert.alert('Atenção', 'Não foi possível carregar as compras.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadCompras);
    return unsub;
  }, [navigation, loadCompras]);

  async function onRefresh() { setRefreshing(true); await loadCompras(); setRefreshing(false); }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.warning} /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={compras}
        keyExtractor={item => String(item.cd_parcela)}
        renderItem={({ item }) => (
          <CompraCard item={item} onPagar={() => {}} onArquivar={() => {}} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.warning} />}
        contentContainerStyle={compras.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>Nenhuma compra parcelada</Text>
            <Text style={styles.emptySubText}>Toque no + para registrar</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddCompra')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.md, marginTop: SPACING.sm, borderRadius: RADIUS.md, padding: SPACING.md, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
  cardHeaderLeft: { flex: 1, marginRight: SPACING.sm },
  cardTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  cardValue: { fontSize: FONT.lg, fontWeight: 'bold', color: COLORS.warning },
  parcBadge: { backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 12, alignSelf: 'flex-start' },
  parcBadgeText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginVertical: SPACING.sm },
  progressFill: { height: 4, backgroundColor: COLORS.success, borderRadius: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDate: { fontSize: FONT.sm, color: COLORS.textSecondary },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  btnPagar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.success, paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: 16, gap: 4 },
  btnPagarText: { color: '#fff', fontSize: FONT.sm, fontWeight: '700' },
  btnArquivar: { padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: RADIUS.sm },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.warning, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  emptyContainer: { flexGrow: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: FONT.lg, color: COLORS.textSecondary, marginTop: SPACING.md, fontWeight: '600' },
  emptySubText: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: SPACING.sm },
});
