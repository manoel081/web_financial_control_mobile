import React, { useState, useEffect } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

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

export default function AddRendaExtraScreen({ navigation }) {
  const [descricao, setDescricao] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayFormatted());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  async function handleSave() {
    if (!descricao.trim()) { Alert.alert('Erro', 'Informe uma descrição.'); return; }
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!numericAmount || numericAmount <= 0) { Alert.alert('Erro', 'Informe um valor válido.'); return; }

    setLoading(true);
    try {
      // TODO: integrar com expensesService.createRendaExtra
      await new Promise(r => setTimeout(r, 500));
      Alert.alert('Sucesso', 'Renda extra registrada!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        <Text style={styles.label}>Descrição *</Text>
        <TextInput style={styles.input} placeholder="Ex: Freelance, bônus, venda..." placeholderTextColor={COLORS.textSecondary} value={descricao} onChangeText={setDescricao} autoCapitalize="sentences" />

        <Text style={styles.label}>Valor (R$) *</Text>
        <TextInput style={styles.input} placeholder="0,00" placeholderTextColor={COLORS.textSecondary} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />

        <Text style={styles.label}>Data</Text>
        <View style={styles.inputRow}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
          <TextInput style={[styles.input, styles.inputFlex]} placeholder="DD/MM/AAAA" placeholderTextColor={COLORS.textSecondary} value={date} onChangeText={(t) => setDate(formatDateInput(t))} keyboardType="numeric" maxLength={10} />
        </View>

        <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSave} disabled={loading}>
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
          <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'Registrar Renda Extra'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.sm, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: 14, fontSize: FONT.md, borderWidth: 1, borderColor: COLORS.border, color: COLORS.textPrimary },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputIcon: { marginRight: SPACING.sm },
  inputFlex: { flex: 1 },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.success, borderRadius: RADIUS.md, padding: 16, marginTop: SPACING.xl, gap: SPACING.sm },
  saveButtonDisabled: { backgroundColor: '#82E0AA' },
  saveButtonText: { color: '#fff', fontSize: FONT.lg, fontWeight: 'bold' },
});
