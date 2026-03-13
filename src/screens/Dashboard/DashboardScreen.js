import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, RefreshControl, ScrollView,
  StyleSheet, Text, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

function formatCurrency(value) {
  return `R$ ${parseFloat(value || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalExpenses: 0, totalPurchases: 0, salary: 0, balance: 0, totalRendaExtra: 0,
  });

  const loadDashboard = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('wf_currentUser');
      if (!userData) {
        navigation.getParent()?.getParent()?.replace('Auth');
        return;
      }
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      const response = await api.get('/api/me', { params: { userId: parsedUser.cd_usuario } });
      const { totalExpenses = 0, totalFirstParcels = 0, salary } = response.data;
      const salaryValue = salary ? parseFloat(salary.valor_salario) || 0 : 0;
      const expensesValue = parseFloat(totalExpenses) || 0;
      const purchasesValue = parseFloat(totalFirstParcels) || 0;
      const balance = salaryValue - expensesValue - purchasesValue;

      setSummary({ totalExpenses: expensesValue, totalPurchases: purchasesValue, salary: salaryValue, balance, totalRendaExtra: 0 });
    } catch (error) {
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('wf_currentUser');
        navigation.getParent()?.getParent()?.replace('Auth');
      } else {
        Alert.alert('Atenção', 'Não foi possível carregar os dados financeiros.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadDashboard);
    return unsubscribe;
  }, [navigation, loadDashboard]);

  async function onRefresh() {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }

  const now = new Date();
  const monthName = now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isPositive = summary.balance >= 0;

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{getInitials(user?.nome_completo)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.greeting}>Olá, {user?.nome_completo?.split(' ')[0] || 'Usuário'} 👋</Text>
          <Text style={styles.monthLabel}>{monthName}</Text>
        </View>
      </View>

      {/* Saldo */}
      <View style={[styles.balanceCard, isPositive ? styles.balancePositive : styles.balanceNegative]}>
        <Text style={styles.balanceLabel}>Saúde Financeira</Text>
        <Ionicons name={isPositive ? 'checkmark-circle' : 'warning'} size={28} color="rgba(255,255,255,0.9)" style={{ marginTop: 4 }} />
        <Text style={styles.balanceTitle}>Saldo do Mês</Text>
        <Text style={styles.balanceValue}>{formatCurrency(summary.balance)}</Text>
        {summary.salary > 0 && <Text style={styles.salaryInfo}>Salário: {formatCurrency(summary.salary)}</Text>}
      </View>

      {/* Cards de resumo */}
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, { borderTopColor: COLORS.danger }]}>
          <Ionicons name="trending-down" size={24} color={COLORS.danger} />
          <Text style={styles.summaryLabel}>Gastos</Text>
          <Text style={[styles.summaryValue, { color: COLORS.danger }]}>{formatCurrency(summary.totalExpenses)}</Text>
        </View>
        <View style={[styles.summaryCard, { borderTopColor: COLORS.warning }]}>
          <Ionicons name="cart" size={24} color={COLORS.warning} />
          <Text style={styles.summaryLabel}>Compras</Text>
          <Text style={[styles.summaryValue, { color: COLORS.warning }]}>{formatCurrency(summary.totalPurchases)}</Text>
        </View>
        <View style={[styles.summaryCard, { borderTopColor: COLORS.success }]}>
          <Ionicons name="trending-up" size={24} color={COLORS.success} />
          <Text style={styles.summaryLabel}>Renda Extra</Text>
          <Text style={[styles.summaryValue, { color: COLORS.success }]}>{formatCurrency(summary.totalRendaExtra)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, paddingTop: SPACING.xl, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  avatarText: { color: '#fff', fontSize: FONT.md, fontWeight: 'bold' },
  headerInfo: { flex: 1 },
  greeting: { fontSize: FONT.lg, fontWeight: 'bold', color: COLORS.textPrimary },
  monthLabel: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  balanceCard: { margin: SPACING.md, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center' },
  balancePositive: { backgroundColor: COLORS.success },
  balanceNegative: { backgroundColor: COLORS.danger },
  balanceLabel: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  balanceTitle: { fontSize: FONT.md, color: 'rgba(255,255,255,0.85)', marginTop: SPACING.sm },
  balanceValue: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  salaryInfo: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.75)', marginTop: 6 },
  summaryGrid: { flexDirection: 'row', paddingHorizontal: SPACING.sm, marginBottom: SPACING.md },
  summaryCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginHorizontal: SPACING.xs, alignItems: 'center', borderTopWidth: 3 },
  summaryLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 6, fontWeight: '600' },
  summaryValue: { fontSize: 13, fontWeight: 'bold', marginTop: 4 },
});
