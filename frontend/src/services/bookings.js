import api from './api.js';

export const bookingService = {
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getMyBookings() {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  async getAllBookings() {
    const response = await api.get('/bookings');
    return response.data;
  },

  async updateBookingStatus(id, statusData) {
    const response = await api.patch(`/bookings/${id}/status`, statusData);
    return response.data;
  }
};