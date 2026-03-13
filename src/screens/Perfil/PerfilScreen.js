import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, RefreshControl, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { COLORS, SPACING, RADIUS, FONT } from '../../constants/theme';

function formatCurrency(value) {
  return 'R$ ' + parseFloat(value || 0).toFixed(2).replace('.', ',');
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function InfoRow({ icon, label, value, onEdit }) {
  return (
    <TouchableOpacity style={styles.infoRow} onPress={onEdit} activeOpacity={onEdit ? 0.7 : 1}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={18} color={COLORS.primary} style={styles.infoIcon} />
        <View>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value || 'Não informado'}</Text>
        </View>
      </View>
      {onEdit && <Ionicons name="pencil-outline" size={16} color={COLORS.textSecondary} />}
    </TouchableOpacity>
  );
}

export default function PerfilScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPerfil = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('wf_currentUser');
      if (!userData) return;
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // TODO: integrar com perfilService.getPerfil
      setPerfil({ salary: 0, vale: false, vale_valor: 0, vale_saldo: 0 });
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadPerfil);
    return unsub;
  }, [navigation, loadPerfil]);

  async function onRefresh() { setRefreshing(true); await loadPerfil(); setRefreshing(false); }

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('wf_currentUser');
          navigation.getParent()?.getParent()?.replace('Auth');
        },
      },
    ]);
  }

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  const initials = getInitials(user?.nome_completo);
  const firstName = user?.nome_completo?.split(' ')[0] || '';
  const lastName = user?.nome_completo?.split(' ').slice(1).join(' ') || '';
  const memberSince = user?.dt_cadastro ? new Date(user.dt_cadastro).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : '—';

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
          <View style={styles.avatarCameraIcon}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.nome_completo}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.memberSince}>Membro desde {memberSince}</Text>
      </View>

      {/* Informações Pessoais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <View style={styles.sectionCard}>
          <InfoRow icon="person-outline" label="Nome" value={user?.nome_completo} onEdit={() => {}} />
          <View style={styles.divider} />
          <InfoRow icon="mail-outline" label="E-mail" value={user?.email} onEdit={() => {}} />
          <View style={styles.divider} />
          <InfoRow icon="calendar-outline" label="Data de Nascimento" value={user?.data_nascimento} onEdit={() => {}} />
        </View>
      </View>

      {/* Financeiro */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financeiro</Text>
        <View style={styles.sectionCard}>
          <InfoRow icon="wallet-outline" label="Salário Mensal" value={perfil?.salary > 0 ? formatCurrency(perfil.salary) : null} onEdit={() => {}} />
          <View style={styles.divider} />
          <InfoRow icon="restaurant-outline" label="Vale Refeição / Alimentação" value={perfil?.vale ? formatCurrency(perfil.vale_valor) + '/mês' : 'Não configurado'} onEdit={() => {}} />
        </View>
      </View>

      {/* Conta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('AlterarSenha')}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
            <Text style={styles.menuText}>Alterar Senha</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} style={styles.menuChevron} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('Veiculos')}>
            <Ionicons name="car-outline" size={20} color={COLORS.primary} />
            <Text style={styles.menuText}>Meus Veículos</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} style={styles.menuChevron} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarSection: { alignItems: 'center', backgroundColor: COLORS.surface, paddingVertical: SPACING.xl, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  avatarCameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primaryDark, borderRadius: 12, padding: 4 },
  userName: { fontSize: FONT.xl, fontWeight: 'bold', color: COLORS.textPrimary },
  userEmail: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: 4 },
  memberSince: { fontSize: FONT.sm, color: COLORS.textSecondary, marginTop: 4, textTransform: 'capitalize' },
  section: { marginTop: SPACING.lg, paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm, marginLeft: SPACING.xs },
  sectionCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  infoLeft: { flexDirection: 'row', alignItems: 'center' },
  infoIcon: { marginRight: SPACING.md },
  infoLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  infoValue: { fontSize: FONT.md, color: COLORS.textPrimary, marginTop: 2 },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
  menuText: { flex: 1, fontSize: FONT.md, color: COLORS.textPrimary, marginLeft: SPACING.md },
  menuChevron: { marginLeft: 'auto' },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.xl + 18 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm, borderWidth: 1, borderColor: COLORS.danger + '40' },
  logoutText: { fontSize: FONT.md, color: COLORS.danger, fontWeight: '600' },
});
