import api from './api';

export const perfilService = {
  async getPerfil() {
    try {
      const response = await api.get('/api/user/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao carregar perfil.' };
    }
  },

  async updatePerfil(data) {
    try {
      const response = await api.put('/api/user/profile', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao atualizar perfil.' };
    }
  },

  async updateSalario(valor_salario) {
    try {
      const response = await api.post('/api/salary', { valor_salario });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao atualizar salário.' };
    }
  },

  async updateValeAlimentacao(data) {
    try {
      const response = await api.post('/api/vale-alimentacao', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao atualizar vale alimentação.' };
    }
  },

  async alterarSenha(senha_atual, nova_senha) {
    try {
      const response = await api.post('/api/auth/change-password', { senha_atual, nova_senha });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Senha atual incorreta.' };
    }
  },
};

export default perfilService;
