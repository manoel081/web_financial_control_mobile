import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_DEV_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.120.161.158:3000';
const API_PROD_URL = 'https://seu-servidor-producao.com';

export const API_BASE_URL = __DEV__ ? API_DEV_URL : API_PROD_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const userData = await AsyncStorage.getItem('wf_currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        if (user?.cd_usuario) {
          config.headers['x-user-id'] = String(user.cd_usuario);
        }
      }
    } catch {}

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
      error.friendlyMessage = 'Nao foi possivel conectar ao servidor. Verifique a conexao ou a URL da API.';
    } else if (error.response?.status === 401) {
      error.friendlyMessage = 'Sessao expirada. Faca login novamente.';
    } else if (error.response?.status >= 500) {
      error.friendlyMessage = 'Erro interno no servidor. Tente novamente mais tarde.';
    } else {
      error.friendlyMessage = error.response?.data?.error || error.response?.data?.message || 'Erro inesperado.';
    }

    return Promise.reject(error);
  }
);

export default api;
