import api from './api';

export const veiculosService = {
  async listVeiculos() {
    try {
      const response = await api.get('/api/veiculos');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao listar veículos.' };
    }
  },

  async addVeiculo(data) {
    try {
      const response = await api.post('/api/veiculos', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao cadastrar veículo.' };
    }
  },

  async updateVeiculo(id, data) {
    try {
      const response = await api.put(`/api/veiculos/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao atualizar veículo.' };
    }
  },

  async deleteVeiculo(id) {
    try {
      await api.delete(`/api/veiculos/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao remover veículo.' };
    }
  },
};

export default veiculosService;
