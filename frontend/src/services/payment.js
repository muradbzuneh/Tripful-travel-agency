import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const paymentService = {
  // Initialize payment with Chapa
  initializePayment: async (paymentData) => {
    try {
      const response = await axios.post(`${API_URL}/api/payments/pay`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify payment status
  verifyPayment: async (tx_ref) => {
    try {
      const response = await axios.get(`${API_URL}/api/payments/verify?tx_ref=${tx_ref}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};