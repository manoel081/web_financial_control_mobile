import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createExpense } from '../services/expensesService';

export default function AddExpenseScreen({ navigation, route }) {
  const fixoInicial = route.params?.fixo ?? false;
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fixo, setFixo] = useState(fixoInicial);
  const [loading, setLoading] = useState(false);

  function handleAmountChange(text) {
    const cleaned = text.replace(/[^0-9.,]/g, '').replace(',', '.');
    setAmount(cleaned);
  }

  async function handleSubmit() {
    const trimmedCategory = category.trim();
    const parsedAmount = parseFloat(amount.replace(',', '.'));

    if (!trimmedCategory) {
      Alert.alert('Atencao', 'Informe a categoria do gasto.');
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Atencao', 'Informe um valor valido maior que zero.');
      return;
    }

    setLoading(true);
    try {
      const result = await createExpense({
        category: trimmedCategory,
        amount: parsedAmount,
        descricao: descricao.trim() || trimmedCategory,
        fixo,
      });

      if (!result.success) {
        throw new Error(result.message || 'Nao foi possivel registrar o gasto.');
      }

      Alert.alert('Sucesso', 'Gasto registrado com sucesso!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Nao foi possivel registrar o gasto.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>{fixo ? 'Novo Gasto Fixo' : 'Novo Gasto'}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Categoria *</Text>
            <TextInput style={styles.input} placeholder="Ex: Alimentacao, Transporte..." placeholderTextColor="#bbb" value={category} onChangeText={setCategory} autoCapitalize="words" />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Valor (R$) *</Text>
            <TextInput style={styles.input} placeholder="0,00" placeholderTextColor="#bbb" value={amount} onChangeText={handleAmountChange} keyboardType="decimal-pad" />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descricao</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Detalhes opcionais..." placeholderTextColor="#bbb" value={descricao} onChangeText={setDescricao} multiline numberOfLines={3} textAlignVertical="top" />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Ionicons name="repeat" size={20} color="#9B59B6" />
              <Text style={styles.switchText}>Gasto Fixo (recorrente)</Text>
            </View>
            <Switch value={fixo} onValueChange={setFixo} trackColor={{ false: '#ddd', true: '#9B59B6' }} thumbColor={fixo ? '#fff' : '#f4f3f4'} />
          </View>

          <TouchableOpacity style={[styles.submitButton, loading && styles.submitDisabled]} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <><Ionicons name="checkmark-circle" size={22} color="#fff" /><Text style={styles.submitText}>Registrar Gasto</Text></>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E1E8ED' },
  backButton: { marginRight: 16, padding: 4 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  form: { padding: 20 },
  field: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E1E8ED', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#333' },
  textArea: { minHeight: 80, paddingTop: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 24, borderWidth: 1, borderColor: '#E1E8ED' },
  switchLabel: { flexDirection: 'row', alignItems: 'center' },
  switchText: { fontSize: 15, color: '#444', marginLeft: 10 },
  submitButton: { backgroundColor: '#4A90E2', borderRadius: 12, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  submitDisabled: { backgroundColor: '#A8C7F0' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});
