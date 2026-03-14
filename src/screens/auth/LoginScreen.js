import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/authService';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

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
    if (!email || !senha) { Alert.alert('Erro', 'Preencha e-mail e senha.'); return; }
    if (senha.length < 6) { Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.'); return; }
    if (isRegister) {
      if (!nomeCompleto.trim()) { Alert.alert('Erro', 'Informe seu nome completo.'); return; }
      if (!parseDateToDB(dataNascimento)) { Alert.alert('Erro', 'Informe a data no formato DD/MM/AAAA.'); return; }
    }

    setLoading(true);
    try {
      const result = isRegister
        ? await authService.register({
            nome_completo: nomeCompleto.trim(),
            data_nascimento: parseDateToDB(dataNascimento),
            email: email.trim().toLowerCase(),
            senha,
          })
        : await authService.login(email.trim().toLowerCase(), senha);

      if (result.success) {
        await AsyncStorage.setItem('wf_currentUser', JSON.stringify(result.user));
        navigation.getParent()?.replace('MainTabs');
      } else {
        Alert.alert('Erro', result.message || 'Falha na autenticação.');
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
    <LinearGradient colors={COLORS.primaryGradient} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>💰 FinControl</Text>
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
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#aaa"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={styles.eyeButton}>
                <Ionicons name={senhaVisivel ? 'eye-off' : 'eye'} size={22} color="#aaa" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleAuth} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Aguarde...' : isRegister ? 'Criar Conta' : 'Entrar'}</Text>
            </TouchableOpacity>

            {!isRegister && (
              <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
              <Text style={styles.toggleText}>{isRegister ? 'Já tem conta? Fazer login' : 'Não tem conta? Cadastre-se'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, paddingTop: 70, paddingBottom: 40 },
  title: { fontSize: FONT.title, fontWeight: 'bold', color: '#fff', marginBottom: 8, letterSpacing: -1 },
  subtitle: { fontSize: FONT.md, color: COLORS.textLight, marginBottom: 40 },
  form: { width: '100%', maxWidth: 400 },
  label: { color: COLORS.textLight, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: RADIUS.sm, padding: 14, fontSize: 16, marginBottom: SPACING.md, color: COLORS.textPrimary },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.sm, marginBottom: SPACING.md },
  inputFlex: { flex: 1, padding: 14, fontSize: 16, color: COLORS.textPrimary },
  eyeButton: { paddingHorizontal: 14, paddingVertical: 14 },
  button: { backgroundColor: COLORS.success, borderRadius: RADIUS.sm, padding: 15, alignItems: 'center', marginTop: SPACING.sm },
  buttonDisabled: { backgroundColor: '#95E1B7' },
  buttonText: { color: '#fff', fontSize: FONT.lg, fontWeight: 'bold' },
  forgotButton: { marginTop: SPACING.md, alignItems: 'center' },
  forgotText: { color: COLORS.textLight, fontSize: FONT.md, textDecorationLine: 'underline' },
  toggleButton: { marginTop: SPACING.lg, alignItems: 'center' },
  toggleText: { color: '#fff', fontSize: FONT.md, textDecorationLine: 'underline' },
});
