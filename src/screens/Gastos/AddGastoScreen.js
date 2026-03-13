import React, { useState, useEffect } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Switch, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

const CATEGORIES = [
  { label: 'Alimentação',  icon: 'restaurant',         color: COLORS.warning },
  { label: 'Transporte',   icon: 'car',                color: COLORS.primary },
  { label: 'Saúde',        icon: 'medical',            color: COLORS.danger },
  { label: 'Lazer',        icon: 'game-controller',    color: COLORS.purple },
  { label: 'Educação',     icon: 'book',               color: COLORS.success },
  { label: 'Moradia',      icon: 'home',               color: '#8B4513' },
  { label: 'Serviços',     icon: 'receipt',            color: '#16A085' },
  { label: 'Outros',       icon: 'ellipsis-horizontal',color: COLORS.textSecondary },
];

function formatDateInput(text) {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
}

function getTodayFormatted() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export default function AddGastoScreen({ navigation, route }) {
  const fixoInicial = route.params?.fixo ?? false;
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fixo, setFixo] = useState(fixoInicial);
  const [date, setDate] = useState(getTodayFormatted());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  async function handleSave() {
    if (!category) { Alert.alert('Erro', 'Selecione uma categoria.'); return; }
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!numericAmount || numericAmount <= 0) { Alert.alert('Erro', 'Informe um valor válido.'); return; }

    setLoading(true);
    try {
      // TODO: integrar com expensesService.createExpense
      await new Promise(r => setTimeout(r, 500));
      Alert.alert('Sucesso', 'Gasto registrado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>Categoria *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
            const selected = category === cat.label;
            return (
              <TouchableOpacity key={cat.label} style={[styles.categoryChip, selected && { backgroundColor: cat.color, borderColor: cat.color }]} onPress={() => setCategory(cat.label)}>
                <Ionicons name={cat.icon} size={16} color={selected ? '#fff' : cat.color} />
                <Text style={[styles.categoryChipText, selected && { color: '#fff' }]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionLabel}>Valor (R$) *</Text>
        <TextInput style={styles.input} placeholder="0,00" placeholderTextColor={COLORS.textSecondary} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />

        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.inputRow}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
          <TextInput style={[styles.input, styles.inputFlex]} placeholder="DD/MM/AAAA" placeholderTextColor={COLORS.textSecondary} value={date} onChangeText={(t) => setDate(formatDateInput(t))} keyboardType="numeric" maxLength={10} />
        </View>

        <Text style={styles.sectionLabel}>Descrição (opcional)</Text>
        <TextInput style={[styles.input, styles.inputMultiline]} placeholder="Detalhe o gasto..." placeholderTextColor={COLORS.textSecondary} value={descricao} onChangeText={setDescricao} multiline numberOfLines={3} textAlignVertical="top" />

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Gasto Fixo</Text>
            <Text style={styles.switchSub}>Repete todos os meses</Text>
          </View>
          <Switch value={fixo} onValueChange={setFixo} trackColor={{ false: COLORS.border, true: COLORS.purple }} thumbColor={fixo ? '#fff' : '#fff'} />
        </View>

        <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSave} disabled={loading}>
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
          <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'Registrar Gasto'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.sm, marginTop: SPACING.md },
  categoryScroll: { marginBottom: SPACING.xs },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.surface, marginRight: SPACING.sm },
  categoryChipText: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.textPrimary, marginLeft: 6 },
  input: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: 14, fontSize: FONT.md, borderWidth: 1, borderColor: COLORS.border, color: COLORS.textPrimary },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputIcon: { marginRight: SPACING.sm },
  inputFlex: { flex: 1 },
  inputMultiline: { minHeight: 80 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  switchLabel: { fontSize: FONT.md, fontWeight: '600', color: COLORS.textPrimary },
  switchSub: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: 2 },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.danger, borderRadius: RADIUS.md, padding: 16, marginTop: SPACING.xl, gap: SPACING.sm },
  saveButtonDisabled: { backgroundColor: '#F1948A' },
  saveButtonText: { color: '#fff', fontSize: FONT.lg, fontWeight: 'bold' },
});
