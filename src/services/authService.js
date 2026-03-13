import api from './api';

const authService = {
  async login(email, senha) {
    try {
      const response = await api.post('/api/auth/login', { email, senha });
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao fazer login.' };
    }
  },

  async register({ nome_completo, data_nascimento, email, senha }) {
    try {
      const response = await api.post('/api/auth/register', {
        nome_completo,
        data_nascimento,
        email,
        senha,
      });
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao criar conta.' };
    }
  },

  async getUserData(userId) {
    try {
      const response = await api.get('/api/user/profile', { params: { userId } });
      return { success: true, data: response.data.user };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao buscar dados do usuario.' };
    }
  },
};

export default authService;
