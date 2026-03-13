import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalPurchases: 0,
    salary: 0,
    balance: 0,
  });

  const loadDashboard = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('wf_currentUser');
      if (!userData) {
        navigation.replace('Login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      const response = await api.get('/api/me', {
        params: { userId: parsedUser.cd_usuario },
      });

      const { totalExpenses = 0, totalFirstParcels = 0, salary } = response.data;
      const salaryValue = salary ? parseFloat(salary.valor_salario) || 0 : 0;
      const expensesValue = parseFloat(totalExpenses) || 0;
      const purchasesValue = parseFloat(totalFirstParcels) || 0;
      const balance = salaryValue - expensesValue - purchasesValue;

      setSummary({
        totalExpenses: expensesValue,
        totalPurchases: purchasesValue,
        salary: salaryValue,
        balance,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('wf_currentUser');
        navigation.replace('Login');
      } else {
        Alert.alert('Atencao', 'Nao foi possivel carregar os dados financeiros.');
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

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('wf_currentUser');
          navigation.replace('Login');
        },
      },
    ]);
  }

  function formatCurrency(value) {
    return `R$ ${parseFloat(value || 0).toFixed(2).replace('.', ',')}`;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4A90E2" />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Ola,</Text>
          <Text style={styles.userName}>{user?.nome_completo?.split(' ')[0] || user?.email || 'Usuario'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <View style={[styles.balanceCard, summary.balance >= 0 ? styles.balancePositive : styles.balanceNegative]}>
        <Text style={styles.balanceLabel}>Saldo do Mes</Text>
        <Text style={styles.balanceValue}>{formatCurrency(summary.balance)}</Text>
        {summary.salary > 0 && <Text style={styles.salaryInfo}>Salario: {formatCurrency(summary.salary)}</Text>}
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="trending-down" size={28} color="#E74C3C" />
          <Text style={styles.summaryLabel}>Gastos</Text>
          <Text style={[styles.summaryValue, { color: '#E74C3C' }]}>{formatCurrency(summary.totalExpenses)}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons name="cart" size={28} color="#F39C12" />
          <Text style={styles.summaryLabel}>Compras</Text>
          <Text style={[styles.summaryValue, { color: '#F39C12' }]}>{formatCurrency(summary.totalPurchases)}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons name="wallet" size={28} color="#2ECC71" />
          <Text style={styles.summaryLabel}>Salario</Text>
          <Text style={[styles.summaryValue, { color: '#2ECC71' }]}>{formatCurrency(summary.salary)}</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acoes Rapidas</Text>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddExpense', { fixo: false })}>
          <Ionicons name="add-circle" size={24} color="#4A90E2" />
          <Text style={styles.actionText}>Novo Gasto</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddExpense', { fixo: true })}>
          <Ionicons name="repeat" size={24} color="#9B59B6" />
          <Text style={styles.actionText}>Gasto Fixo</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  greeting: { fontSize: 15, color: '#888' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  logoutButton: { padding: 8 },
  balanceCard: { margin: 16, borderRadius: 16, padding: 24, alignItems: 'center' },
  balancePositive: { backgroundColor: '#2ECC71' },
  balanceNegative: { backgroundColor: '#E74C3C' },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  balanceValue: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginTop: 6 },
  salaryInfo: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 6 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  summaryCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginHorizontal: 4, alignItems: 'center' },
  summaryLabel: { fontSize: 11, color: '#888', marginTop: 6, fontWeight: '600' },
  summaryValue: { fontSize: 13, fontWeight: 'bold', color: '#333', marginTop: 4 },
  quickActions: { padding: 16, paddingTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12, marginLeft: 4 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10 },
  actionText: { fontSize: 16, color: '#333', marginLeft: 14, flex: 1, fontWeight: '500' },
  chevron: { marginLeft: 'auto' },
});
