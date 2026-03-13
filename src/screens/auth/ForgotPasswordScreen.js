import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) { Alert.alert('Erro', 'Informe seu e-mail.'); return; }
    setLoading(true);
    try {
      // TODO: integrar com authService.forgotPassword
      await new Promise(r => setTimeout(r, 1000));
      setSent(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
          <Text style={styles.successTitle}>E-mail enviado!</Text>
          <Text style={styles.successText}>Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.iconContainer}>
          <Ionicons name="lock-open-outline" size={56} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.description}>
          Informe seu e-mail cadastrado. Enviaremos um link para você criar uma nova senha.
        </Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor={COLORS.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Enviar link de recuperação'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, padding: SPACING.xl, paddingTop: SPACING.xxl },
  iconContainer: { alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontSize: FONT.xl, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  description: { fontSize: FONT.md, color: COLORS.textSecondary, lineHeight: 22, marginBottom: SPACING.xl },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  input: { backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, padding: 14, fontSize: FONT.md, borderWidth: 1, borderColor: COLORS.border, color: COLORS.textPrimary, marginBottom: SPACING.xl },
  button: { backgroundColor: COLORS.primary, borderRadius: RADIUS.sm, padding: 15, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#A8C8F0' },
  buttonText: { color: '#fff', fontSize: FONT.lg, fontWeight: 'bold' },
  successCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  successTitle: { fontSize: FONT.xl, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  successText: { fontSize: FONT.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xl },
});
