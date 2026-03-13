import api from './api';

export const comprasService = {
  async listCompras() {
    try {
      const response = await api.get('/api/compras');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao listar compras.' };
    }
  },

  async createCompra(data) {
    try {
      const response = await api.post('/api/compras', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao registrar compra.' };
    }
  },

  async pagarParcela(parcela_id) {
    try {
      const response = await api.post(`/api/compras/parcelas/${parcela_id}/pagar`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao pagar parcela.' };
    }
  },

  async desfazerPagamento(parcela_id) {
    try {
      const response = await api.post(`/api/compras/parcelas/${parcela_id}/desfazer`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao desfazer pagamento.' };
    }
  },

  async arquivarCompra(compra_id) {
    try {
      const response = await api.patch(`/api/compras/${compra_id}/arquivar`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao arquivar compra.' };
    }
  },

  async listArquivadas() {
    try {
      const response = await api.get('/api/compras/arquivadas');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao listar arquivadas.' };
    }
  },
};

export default comprasService;
