import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import GastosScreen from '../screens/Gastos/GastosScreen';
import AddGastoScreen from '../screens/Gastos/AddGastoScreen';
import AddRendaExtraScreen from '../screens/Gastos/AddRendaExtraScreen';
import ComprasScreen from '../screens/Compras/ComprasScreen';
import AddCompraScreen from '../screens/Compras/AddCompraScreen';
import ComprasArquivadasScreen from '../screens/Compras/ComprasArquivadasScreen';
import RelatoriosScreen from '../screens/Relatorios/RelatoriosScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';
import AlterarSenhaScreen from '../screens/Perfil/AlterarSenhaScreen';
import VeiculosScreen from '../screens/Perfil/VeiculosScreen';
import AddVeiculoScreen from '../screens/Perfil/AddVeiculoScreen';

import { COLORS } from '../constants/theme';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const InicioStack = createNativeStackNavigator();
const GastosStack = createNativeStackNavigator();
const ComprasStack = createNativeStackNavigator();
const RelatoriosStack = createNativeStackNavigator();
const PerfilStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function InicioNavigator() {
  return (
    <InicioStack.Navigator screenOptions={{ headerShown: false }}>
      <InicioStack.Screen name="Dashboard" component={DashboardScreen} />
    </InicioStack.Navigator>
  );
}

function GastosNavigator() {
  return (
    <GastosStack.Navigator screenOptions={{ headerShown: false }}>
      <GastosStack.Screen name="GastosMain" component={GastosScreen} />
      <GastosStack.Screen
        name="AddGasto"
        component={AddGastoScreen}
        options={{
          headerShown: true,
          title: 'Novo Gasto',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
        }}
      />
      <GastosStack.Screen
        name="AddRendaExtra"
        component={AddRendaExtraScreen}
        options={{
          headerShown: true,
          title: 'Nova Renda Extra',
          headerStyle: { backgroundColor: COLORS.success },
          headerTintColor: '#fff',
        }}
      />
    </GastosStack.Navigator>
  );
}

function ComprasNavigator() {
  return (
    <ComprasStack.Navigator screenOptions={{ headerShown: false }}>
      <ComprasStack.Screen name="ComprasMain" component={ComprasScreen} />
      <ComprasStack.Screen
        name="AddCompra"
        component={AddCompraScreen}
        options={{
          headerShown: true,
          title: 'Nova Compra',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
        }}
      />
      <ComprasStack.Screen
        name="ComprasArquivadas"
        component={ComprasArquivadasScreen}
        options={{
          headerShown: true,
          title: 'Arquivadas',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
        }}
      />
    </ComprasStack.Navigator>
  );
}

function RelatoriosNavigator() {
  return (
    <RelatoriosStack.Navigator screenOptions={{ headerShown: false }}>
      <RelatoriosStack.Screen name="RelatoriosMain" component={RelatoriosScreen} />
    </RelatoriosStack.Navigator>
  );
}

function PerfilNavigator() {
  return (
    <PerfilStack.Navigator screenOptions={{ headerShown: false }}>
      <PerfilStack.Screen name="PerfilMain" component={PerfilScreen} />
      <PerfilStack.Screen
        name="AlterarSenha"
        component={AlterarSenhaScreen}
        options={{
          headerShown: true,
          title: 'Alterar Senha',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
        }}
      />
      <PerfilStack.Screen
        name="Veiculos"
        component={VeiculosScreen}
        options={{
          headerShown: true,
          title: 'Meus Veículos',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
        }}
      />
      <PerfilStack.Screen
        name="AddVeiculo"
        component={AddVeiculoScreen}
        options={{
          headerShown: true,
          title: 'Adicionar Veículo',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
        }}
      />
    </PerfilStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Inicio: focused ? 'home' : 'home-outline',
            Gastos: focused ? 'wallet' : 'wallet-outline',
            Compras: focused ? 'cart' : 'cart-outline',
            Relatorios: focused ? 'bar-chart' : 'bar-chart-outline',
            Perfil: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioNavigator} options={{ title: 'Início' }} />
      <Tab.Screen name="Gastos" component={GastosNavigator} />
      <Tab.Screen name="Compras" component={ComprasNavigator} />
      <Tab.Screen name="Relatorios" component={RelatoriosNavigator} options={{ title: 'Relatórios' }} />
      <Tab.Screen name="Perfil" component={PerfilNavigator} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await AsyncStorage.getItem('wf_currentUser');
        setInitialRoute(userData ? 'MainTabs' : 'Auth');
      } catch {
        setInitialRoute('Auth');
      }
    }
    checkAuth();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
