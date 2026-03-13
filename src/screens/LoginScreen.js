import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  function formatDateInput(text) {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  }

  function parseDateToDB(dateStr) {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    if (!day || !month || !year || year.length !== 4) return null;
    return `${year}-${month}-${day}`;
  }

  async function handleAuth() {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha e-mail e senha.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no minimo 6 caracteres.');
      return;
    }

    if (isRegister) {
      if (!nomeCompleto.trim()) {
        Alert.alert('Erro', 'Informe seu nome completo.');
        return;
      }

      const dbDate = parseDateToDB(dataNascimento);
      if (!dbDate) {
        Alert.alert('Erro', 'Informe a data de nascimento no formato DD/MM/AAAA.');
        return;
      }
    }

    setLoading(true);

    try {
      let result;
      if (isRegister) {
        result = await authService.register({
          nome_completo: nomeCompleto.trim(),
          data_nascimento: parseDateToDB(dataNascimento),
          email: email.trim().toLowerCase(),
          senha,
        });
      } else {
        result = await authService.login(email.trim().toLowerCase(), senha);
      }

      if (result.success) {
        await AsyncStorage.setItem('wf_currentUser', JSON.stringify(result.user));
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Erro', result.message || 'Falha na autenticacao.');
      }
    } catch {
      Alert.alert('Erro', 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setIsRegister(!isRegister);
    setNomeCompleto('');
    setDataNascimento('');
  }

  return (
    <LinearGradient colors={['#4A90E2', '#357ABD', '#2C5F8D']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>FinControl</Text>
          <Text style={styles.subtitle}>Controle Financeiro Pessoal</Text>

          <View style={styles.form}>
            {isRegister && (
              <>
                <Text style={styles.label}>Nome completo</Text>
                <TextInput style={styles.input} placeholder="Seu nome completo" placeholderTextColor="#aaa" value={nomeCompleto} onChangeText={setNomeCompleto} autoCapitalize="words" autoCorrect={false} />
                <Text style={styles.label}>Data de nascimento</Text>
                <TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor="#aaa" value={dataNascimento} onChangeText={(t) => setDataNascimento(formatDateInput(t))} keyboardType="numeric" maxLength={10} />
              </>
            )}

            <Text style={styles.label}>E-mail</Text>
            <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />

            <Text style={styles.label}>Senha</Text>
            <TextInput style={styles.input} placeholder="Minimo 6 caracteres" placeholderTextColor="#aaa" value={senha} onChangeText={setSenha} secureTextEntry autoCapitalize="none" />

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleAuth} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Aguarde...' : isRegister ? 'Criar Conta' : 'Entrar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
              <Text style={styles.toggleText}>{isRegister ? 'Ja tem conta? Fazer login' : 'Criar nova conta'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 17, color: '#E8F4FD', marginBottom: 40 },
  form: { width: '100%', maxWidth: 400 },
  label: { color: '#E8F4FD', fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 16, color: '#333' },
  button: { backgroundColor: '#2ECC71', borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#95E1B7' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  toggleButton: { marginTop: 22, alignItems: 'center' },
  toggleText: { color: '#fff', fontSize: 16, textDecorationLine: 'underline' },
});
