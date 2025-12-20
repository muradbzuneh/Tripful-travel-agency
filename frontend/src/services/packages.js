import api from './api.js';

export const packageService = {
  async getActivePackages() {
    const response = await api.get('/packages');
    return response.data;
  },

  async getAllPackages() {
    const response = await api.get('/packages/all');
    return response.data;
  },

  async createPackage(packageData) {
    const response = await api.post('/packages', packageData);
    return response.data;
  },

  async updatePackage(id, packageData) {
    const response = await api.put(`/packages/${id}`, packageData);
    return response.data;
  },

  async deactivatePackage(id) {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  }
};