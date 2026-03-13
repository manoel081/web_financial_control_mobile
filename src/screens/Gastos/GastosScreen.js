import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

const TopTab = createMaterialTopTabNavigator();

function formatCurrency(value) {
  return 'R$ ' + parseFloat(value || 0).toFixed(2).replace('.', ',');
}

function GastoItem({ item, onDelete }) {
  const iconMap = {
    'Alimentação': 'restaurant', 'Transporte': 'car', 'Saúde': 'medical',
    'Lazer': 'game-controller', 'Educação': 'book', 'Moradia': 'home', 'Serviços': 'receipt',
  };
  return (
    <View style={styles.card}>
      <View style={[styles.cardIcon, { backgroundColor: item.fixo ? COLORS.purple + '20' : COLORS.danger + '15' }]}>
        <Ionicons name={iconMap[item.categoria] || 'ellipsis-horizontal'} size={22} color={item.fixo ? COLORS.purple : COLORS.danger} />
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardRow}>
          <Text style={styles.cardTitle}>{item.categoria}</Text>
          {item.fixo && <View style={styles.badge}><Text style={styles.badgeText}>Fixo</Text></View>}
        </View>
        {item.descricao ? <Text style={styles.cardSub}>{item.descricao}</Text> : null}
        <Text style={styles.cardDate}>{item.data}</Text>
      </View>
      <Text style={[styles.cardValue, { color: COLORS.danger }]}>{formatCurrency(item.valor)}</Text>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

function RendaItem({ item, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardIcon, { backgroundColor: COLORS.success + '20' }]}>
        <Ionicons name="trending-up" size={22} color={COLORS.success} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.descricao}</Text>
        <Text style={styles.cardDate}>{item.data}</Text>
      </View>
      <Text style={[styles.cardValue, { color: COLORS.success }]}>{formatCurrency(item.valor)}</Text>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

function ListaGastos({ navigation }) {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadGastos = useCallback(async () => {
    try {
      // TODO: integrar com expensesService.listExpenses
      setGastos([]);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadGastos);
    return unsub;
  }, [navigation, loadGastos]);

  async function onRefresh() { setRefreshing(true); await loadGastos(); setRefreshing(false); }

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={gastos}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <GastoItem item={item} onDelete={() => {}} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={gastos.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={56} color={COLORS.border} />
            <Text style={styles.emptyText}>Nenhum gasto registrado</Text>
            <Text style={styles.emptySubText}>Toque no + para adicionar</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddGasto', { fixo: false })}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function ListaRendaExtra({ navigation }) {
  const [rendas, setRendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRendas = useCallback(async () => {
    try {
      // TODO: integrar com expensesService.listRendaExtra
      setRendas([]);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadRendas);
    return unsub;
  }, [navigation, loadRendas]);

  async function onRefresh() { setRefreshing(true); await loadRendas(); setRefreshing(false); }

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={rendas}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <RendaItem item={item} onDelete={() => {}} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={rendas.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="trending-up-outline" size={56} color={COLORS.border} />
            <Text style={styles.emptyText}>Nenhuma renda extra</Text>
            <Text style={styles.emptySubText}>Toque no + para adicionar</Text>
          </View>
        }
      />
      <TouchableOpacity style={[styles.fab, { backgroundColor: COLORS.success }]} onPress={() => navigation.navigate('AddRendaExtra')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export default function GastosScreen() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarIndicatorStyle: { backgroundColor: COLORS.primary, height: 3 },
        tabBarStyle: { backgroundColor: COLORS.surface, elevation: 0, shadowOpacity: 0 },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 13, textTransform: 'none' },
      }}
    >
      <TopTab.Screen name="GastosTab" component={ListaGastos} options={{ tabBarLabel: 'Gastos' }} />
      <TopTab.Screen name="RendaExtraTab" component={ListaRendaExtra} options={{ tabBarLabel: 'Renda Extra' }} />
    </TopTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: SPACING.md, marginTop: SPACING.sm, borderRadius: RADIUS.md, padding: SPACING.md, elevation: 2 },
  cardIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  cardInfo: { flex: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  cardTitle: { fontSize: FONT.md, fontWeight: '600', color: COLORS.textPrimary },
  cardSub: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: 2 },
  cardDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  cardValue: { fontSize: FONT.md, fontWeight: 'bold', marginRight: SPACING.sm },
  deleteBtn: { padding: SPACING.xs },
  badge: { backgroundColor: COLORS.purple + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, color: COLORS.purple, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.danger, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  emptyContainer: { flexGrow: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: FONT.lg, color: COLORS.textSecondary, marginTop: SPACING.md, fontWeight: '600' },
  emptySubText: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: SPACING.sm },
});
