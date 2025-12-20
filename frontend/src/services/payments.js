import api from './api.js';

export const paymentService = {
  async createPayment(paymentData) {
    const response = await api.post('/payments', paymentData);
    return response.data;
  }
};