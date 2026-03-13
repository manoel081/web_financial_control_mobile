import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

export default function AddVeiculoScreen({ navigation }) {
  const [modelo, setModelo] = useState('');
  const [cilindrada, setCilindrada] = useState('');
  const [tanque, setTanque] = useState('');
  const [consumoCidade, setConsumoCidade] = useState('');
  const [consumoEstrada, setConsumoEstrada] = useState('');
  const [percursoDiario, setPercursoDiario] = useState('');
  const [diasTrabalhados, setDiasTrabalhados] = useState('5');
  const [valorGasolina, setValorGasolina] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!modelo.trim()) { Alert.alert('Erro', 'Informe o modelo do veículo.'); return; }
    if (!consumoCidade || parseFloat(consumoCidade.replace(',', '.')) <= 0) { Alert.alert('Erro', 'Informe o consumo na cidade.'); return; }

    setLoading(true);
    try {
      // TODO: integrar com veiculosService.addVeiculo
      await new Promise(r => setTimeout(r, 500));
      Alert.alert('Sucesso', 'Veículo cadastrado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        <Text style={styles.sectionHeader}>Informações Básicas</Text>
        <Text style={styles.label}>Modelo / Nome *</Text>
        <TextInput style={styles.input} placeholder="Ex: Honda Civic 2.0" placeholderTextColor={COLORS.textSecondary} value={modelo} onChangeText={setModelo} autoCapitalize="words" />

        <Text style={styles.label}>Potência / Cilindrada</Text>
        <TextInput style={styles.input} placeholder="Ex: 2.0 Flex" placeholderTextColor={COLORS.textSecondary} value={cilindrada} onChangeText={setCilindrada} />

        <Text style={styles.label}>Capacidade do Tanque (L)</Text>
        <TextInput style={styles.input} placeholder="Ex: 52" placeholderTextColor={COLORS.textSecondary} value={tanque} onChangeText={setTanque} keyboardType="decimal-pad" />

        <Text style={styles.sectionHeader}>Consumo de Combustível</Text>
        <View style={styles.inputsRow}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Cidade (km/L) *</Text>
            <TextInput style={styles.input} placeholder="10,0" placeholderTextColor={COLORS.textSecondary} value={consumoCidade} onChangeText={setConsumoCidade} keyboardType="decimal-pad" />
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Estrada (km/L)</Text>
            <TextInput style={styles.input} placeholder="13,0" placeholderTextColor={COLORS.textSecondary} value={consumoEstrada} onChangeText={setConsumoEstrada} keyboardType="decimal-pad" />
          </View>
        </View>

        <Text style={styles.sectionHeader}>Percurso Diário</Text>
        <View style={styles.inputsRow}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Km por dia</Text>
            <TextInput style={styles.input} placeholder="30" placeholderTextColor={COLORS.textSecondary} value={percursoDiario} onChangeText={setPercursoDiario} keyboardType="decimal-pad" />
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Dias/semana</Text>
            <TextInput style={styles.input} placeholder="5" placeholderTextColor={COLORS.textSecondary} value={diasTrabalhados} onChangeText={setDiasTrabalhados} keyboardType="numeric" maxLength={1} />
          </View>
        </View>

        <Text style={styles.sectionHeader}>Combustível</Text>
        <Text style={styles.label}>Preço da Gasolina (R$/L)</Text>
        <View style={styles.inputRow}>
          <Ionicons name="pricetag-outline" size={20} color={COLORS.warning} style={styles.inputIcon} />
          <TextInput style={[styles.input, styles.inputFlex]} placeholder="6,00" placeholderTextColor={COLORS.textSecondary} value={valorGasolina} onChangeText={setValorGasolina} keyboardType="decimal-pad" />
        </View>

        <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSave} disabled={loading}>
          <Ionicons name="car" size={22} color="#fff" />
          <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'Adicionar Veículo'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  sectionHeader: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  input: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: 14, fontSize: FONT.md, borderWidth: 1, borderColor: COLORS.border, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  inputsRow: { flexDirection: 'row', gap: SPACING.md },
  inputHalf: { flex: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputIcon: { marginRight: SPACING.sm },
  inputFlex: { flex: 1 },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 16, marginTop: SPACING.xl, gap: SPACING.sm },
  saveButtonDisabled: { backgroundColor: '#A8C8F0' },
  saveButtonText: { color: '#fff', fontSize: FONT.lg, fontWeight: 'bold' },
});
