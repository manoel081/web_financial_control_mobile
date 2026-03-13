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

function getNextMonthFormatted() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export default function AddCompraScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [numeroParcelas, setNumeroParcelas] = useState('1');
  const [dataInicio, setDataInicio] = useState(getNextMonthFormatted());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const valorParcela = (() => {
    const total = parseFloat(valorTotal.replace(',', '.')) || 0;
    const parcelas = parseInt(numeroParcelas) || 1;
    return parcelas > 0 ? (total / parcelas).toFixed(2).replace('.', ',') : '0,00';
  })();

  async function handleSave() {
    if (!nome.trim()) { Alert.alert('Erro', 'Informe o nome do produto.'); return; }
    const total = parseFloat(valorTotal.replace(',', '.'));
    if (!total || total <= 0) { Alert.alert('Erro', 'Informe um valor total válido.'); return; }
    const parcelas = parseInt(numeroParcelas);
    if (!parcelas || parcelas < 1) { Alert.alert('Erro', 'Informe a quantidade de parcelas.'); return; }

    setLoading(true);
    try {
      // TODO: integrar com comprasService.createCompra
      await new Promise(r => setTimeout(r, 500));
      Alert.alert('Sucesso', 'Compra registrada!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        <Text style={styles.label}>Produto / Serviço *</Text>
        <TextInput style={styles.input} placeholder="Ex: Celular, Notebook, TV..." placeholderTextColor={COLORS.textSecondary} value={nome} onChangeText={setNome} autoCapitalize="sentences" />

        <Text style={styles.label}>Valor Total *</Text>
        <TextInput style={styles.input} placeholder="0,00" placeholderTextColor={COLORS.textSecondary} value={valorTotal} onChangeText={setValorTotal} keyboardType="decimal-pad" />

        <Text style={styles.label}>Número de Parcelas</Text>
        <TextInput style={styles.input} placeholder="1" placeholderTextColor={COLORS.textSecondary} value={numeroParcelas} onChangeText={setNumeroParcelas} keyboardType="numeric" maxLength={3} />

        {parseFloat(valorTotal.replace(',', '.')) > 0 && (
          <View style={styles.calculatedRow}>
            <Ionicons name="calculator-outline" size={18} color={COLORS.success} />
            <Text style={styles.calculatedText}>
              {numeroParcelas}x de{' '}
              <Text style={styles.calculatedValue}>R$ {valorParcela}</Text>
            </Text>
          </View>
        )}

        <Text style={styles.label}>Início das Parcelas</Text>
        <View style={styles.inputRow}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.warning} style={styles.inputIcon} />
          <TextInput style={[styles.input, styles.inputFlex]} placeholder="DD/MM/AAAA" placeholderTextColor={COLORS.textSecondary} value={dataInicio} onChangeText={(t) => setDataInicio(formatDateInput(t))} keyboardType="numeric" maxLength={10} />
        </View>

        <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSave} disabled={loading}>
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
          <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'Registrar Compra'}</Text>
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
  calculatedRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.success + '10', borderRadius: RADIUS.sm, padding: SPACING.md, marginTop: SPACING.sm, gap: SPACING.sm, borderWidth: 1, borderColor: COLORS.success + '30' },
  calculatedText: { fontSize: FONT.md, color: COLORS.textPrimary },
  calculatedValue: { fontWeight: 'bold', color: COLORS.success, fontSize: FONT.lg },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.warning, borderRadius: RADIUS.md, padding: 16, marginTop: SPACING.xl, gap: SPACING.sm },
  saveButtonDisabled: { backgroundColor: '#F8C471' },
  saveButtonText: { color: '#fff', fontSize: FONT.lg, fontWeight: 'bold' },
});
