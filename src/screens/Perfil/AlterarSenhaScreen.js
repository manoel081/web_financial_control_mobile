import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

function PasswordInput({ label, value, onChangeText, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.eyeBtn} onPress={() => setVisible(!visible)}>
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AlterarSenhaScreen({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!senhaAtual) { Alert.alert('Erro', 'Informe a senha atual.'); return; }
    if (novaSenha.length < 6) { Alert.alert('Erro', 'A nova senha deve ter no mínimo 6 caracteres.'); return; }
    if (novaSenha !== confirmarSenha) { Alert.alert('Erro', 'As senhas não conferem.'); return; }

    setLoading(true);
    try {
      // TODO: integrar com perfilService.alterarSenha
      await new Promise(r => setTimeout(r, 800));
      Alert.alert('Sucesso', 'Senha alterada com sucesso!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch {
      Alert.alert('Erro', 'Não foi possível alterar a senha. Verifique a senha atual.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={40} color={COLORS.primary} />
        </View>

        <PasswordInput label="Senha Atual *" value={senhaAtual} onChangeText={setSenhaAtual} placeholder="Digite sua senha atual" />
        <PasswordInput label="Nova Senha *" value={novaSenha} onChangeText={setNovaSenha} placeholder="Mínimo 6 caracteres" />
        <PasswordInput label="Confirmar Nova Senha *" value={confirmarSenha} onChangeText={setConfirmarSenha} placeholder="Repita a nova senha" />

        <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Alterando...' : 'Alterar Senha'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  iconContainer: { alignItems: 'center', marginBottom: SPACING.xl, marginTop: SPACING.sm },
  inputWrapper: { marginBottom: SPACING.md },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, padding: 14, fontSize: FONT.md, color: COLORS.textPrimary },
  eyeBtn: { padding: SPACING.md },
  saveButton: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: 16, alignItems: 'center', marginTop: SPACING.xl },
  saveButtonDisabled: { backgroundColor: '#A8C8F0' },
  saveButtonText: { color: '#fff', fontSize: FONT.lg, fontWeight: 'bold' },
});
