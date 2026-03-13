import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Dimensions, FlatList, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function formatCurrency(value) {
  return 'R$ ' + parseFloat(value || 0).toFixed(2).replace('.', ',');
}

function SlideResumo({ data }) {
  return (
    <ScrollView style={styles.slide} contentContainerStyle={styles.slideContent}>
      <Text style={styles.slideTitle}>Resumo do Mês</Text>
      <View style={[styles.resumoCard, { borderLeftColor: COLORS.success }]}>
        <Text style={styles.resumoLabel}>Salário</Text>
        <Text style={[styles.resumoValue, { color: COLORS.success }]}>{formatCurrency(data.salary)}</Text>
      </View>
      <View style={[styles.resumoCard, { borderLeftColor: COLORS.danger }]}>
        <Text style={styles.resumoLabel}>Total Gastos</Text>
        <Text style={[styles.resumoValue, { color: COLORS.danger }]}>{formatCurrency(data.totalExpenses)}</Text>
      </View>
      <View style={[styles.resumoCard, { borderLeftColor: COLORS.warning }]}>
        <Text style={styles.resumoLabel}>Compras Parceladas</Text>
        <Text style={[styles.resumoValue, { color: COLORS.warning }]}>{formatCurrency(data.totalPurchases)}</Text>
      </View>
      <View style={[styles.resumoCard, { borderLeftColor: COLORS.primary }]}>
        <Text style={styles.resumoLabel}>Saldo</Text>
        <Text style={[styles.resumoValue, { color: data.balance >= 0 ? COLORS.success : COLORS.danger }]}>{formatCurrency(data.balance)}</Text>
      </View>
    </ScrollView>
  );
}

function SlideGastosPorCategoria({ data }) {
  const categorias = data.gastosPorCategoria || [];
  const total = categorias.reduce((sum, c) => sum + c.valor, 0);
  return (
    <ScrollView style={styles.slide} contentContainerStyle={styles.slideContent}>
      <Text style={styles.slideTitle}>Gastos por Categoria</Text>
      {categorias.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum dado disponível</Text>
      ) : categorias.map((cat, i) => {
        const pct = total > 0 ? Math.round((cat.valor / total) * 100) : 0;
        return (
          <View key={i} style={styles.catRow}>
            <View style={styles.catInfo}>
              <Text style={styles.catName}>{cat.nome}</Text>
              <Text style={styles.catValue}>{formatCurrency(cat.valor)}</Text>
            </View>
            <View style={styles.catBarBg}>
              <View style={[styles.catBarFill, { width: `${pct}%`, backgroundColor: COLORS.danger }]} />
            </View>
            <Text style={styles.catPct}>{pct}%</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

function SlideHistorico({ data }) {
  const meses = data.historicoMensal || [];
  return (
    <ScrollView style={styles.slide} contentContainerStyle={styles.slideContent}>
      <Text style={styles.slideTitle}>Histórico Mensal</Text>
      {meses.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum dado disponível</Text>
      ) : meses.map((m, i) => (
        <View key={i} style={styles.historicoRow}>
          <Text style={styles.historicoMes}>{m.mes}</Text>
          <Text style={[styles.historicoValor, { color: COLORS.danger }]}>{formatCurrency(m.gastos)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function SlideExportar({ userId }) {
  return (
    <View style={[styles.slide, styles.exportSlide]}>
      <Text style={styles.slideTitle}>Exportar Relatório</Text>
      <Text style={styles.exportDesc}>Gere um PDF completo com todos os lançamentos do mês atual.</Text>
      <TouchableOpacity style={styles.exportBtn}>
        <Ionicons name="document-text-outline" size={24} color="#fff" />
        <Text style={styles.exportBtnText}>Gerar PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.exportBtn, { backgroundColor: COLORS.primary }]}>
        <Ionicons name="share-outline" size={24} color="#fff" />
        <Text style={styles.exportBtnText}>Compartilhar</Text>
      </TouchableOpacity>
    </View>
  );
}

const SLIDES = ['Resumo', 'Por Categoria', 'Histórico', 'Exportar'];

export default function RelatoriosScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState({ salary: 0, totalExpenses: 0, totalPurchases: 0, balance: 0, gastosPorCategoria: [], historicoMensal: [] });
  const [userId, setUserId] = useState(null);
  const flatListRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('wf_currentUser');
      if (!userData) return;
      const user = JSON.parse(userData);
      setUserId(user.cd_usuario);
      const response = await api.get('/api/me', { params: { userId: user.cd_usuario } });
      const { totalExpenses = 0, totalFirstParcels = 0, salary } = response.data;
      const salaryValue = salary ? parseFloat(salary.valor_salario) || 0 : 0;
      const expensesValue = parseFloat(totalExpenses) || 0;
      const purchasesValue = parseFloat(totalFirstParcels) || 0;
      setData({ salary: salaryValue, totalExpenses: expensesValue, totalPurchases: purchasesValue, balance: salaryValue - expensesValue - purchasesValue, gastosPorCategoria: [], historicoMensal: [] });
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadData);
    return unsub;
  }, [navigation, loadData]);

  function onScrollEnd(e) {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  }

  function goToSlide(index) {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  const slides = [
    <SlideResumo data={data} />,
    <SlideGastosPorCategoria data={data} />,
    <SlideHistorico data={data} />,
    <SlideExportar userId={userId} />,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <TouchableOpacity key={i} onPress={() => goToSlide(i)}>
              <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.tabRow}>
        {SLIDES.map((s, i) => (
          <TouchableOpacity key={i} style={[styles.tabBtn, i === activeIndex && styles.tabBtnActive]} onPress={() => goToSlide(i)}>
            <Text style={[styles.tabBtnText, i === activeIndex && styles.tabBtnTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <View style={{ width: SCREEN_WIDTH }}>{item}</View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: FONT.xl, fontWeight: 'bold', color: COLORS.textPrimary },
  dots: { flexDirection: 'row', gap: SPACING.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.primary, width: 20 },
  tabRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tabBtn: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabBtnText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  tabBtnTextActive: { color: COLORS.primary },
  slide: { flex: 1 },
  slideContent: { padding: SPACING.lg },
  slideTitle: { fontSize: FONT.xl, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.lg },
  resumoCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderLeftWidth: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resumoLabel: { fontSize: FONT.md, color: COLORS.textSecondary },
  resumoValue: { fontSize: FONT.lg, fontWeight: 'bold' },
  catRow: { marginBottom: SPACING.md },
  catInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catName: { fontSize: FONT.md, color: COLORS.textPrimary, fontWeight: '500' },
  catValue: { fontSize: FONT.md, color: COLORS.danger, fontWeight: '600' },
  catBarBg: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, flex: 1, marginRight: SPACING.sm },
  catBarFill: { height: 6, borderRadius: 3 },
  catPct: { fontSize: FONT.sm, color: COLORS.textSecondary, width: 36, textAlign: 'right' },
  historicoRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: SPACING.md, marginBottom: SPACING.sm },
  historicoMes: { fontSize: FONT.md, color: COLORS.textPrimary, textTransform: 'capitalize' },
  historicoValor: { fontSize: FONT.md, fontWeight: '600' },
  exportSlide: { justifyContent: 'center', alignItems: 'center' },
  exportDesc: { fontSize: FONT.md, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 22 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.success, borderRadius: RADIUS.md, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, marginBottom: SPACING.md, gap: SPACING.sm, width: '80%', justifyContent: 'center' },
  exportBtnText: { color: '#fff', fontSize: FONT.lg, fontWeight: 'bold' },
  emptyText: { fontSize: FONT.md, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xl },
});
