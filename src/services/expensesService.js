import api from './api';

export async function createExpense(data) {
  return expensesService.createExpense(data);
}

export async function deleteExpense(id) {
  return expensesService.deleteExpense(id);
}

export const expensesService = {
  async createExpense({ category, amount, descricao, fixo = false }) {
    try {
      const response = await api.post('/api/expenses', {
        category,
        amount,
        descricao,
        fixo,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao registrar gasto.' };
    }
  },

  async deleteExpense(id) {
    try {
      await api.delete(`/api/expenses/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.friendlyMessage || 'Erro ao remover gasto.' };
    }
  },
};

export default expensesService;
