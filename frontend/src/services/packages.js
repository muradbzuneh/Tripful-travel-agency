import api from './api.js';

export const packageService = {
  async getActivePackages() {
    const response = await api.get('/packages');
    return response.data;
  },

  async getPackageById(id) {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },

  async getLatestPackages(limit = 2) {
    const response = await api.get(`/packages/latest?limit=${limit}`);
    return response.data;
  },

  async getAllPackages() {
    const response = await api.get('/packages/all');
    return response.data;
  },

  async createPackage(packageData) {
    const formData = new FormData();
    
    // Append all package data
    Object.keys(packageData).forEach(key => {
      if (packageData[key] !== null && packageData[key] !== undefined) {
        formData.append(key, packageData[key]);
      }
    });

    const response = await api.post('/packages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updatePackage(id, packageData) {
    const formData = new FormData();
    
    // Append all package data
    Object.keys(packageData).forEach(key => {
      if (packageData[key] !== null && packageData[key] !== undefined) {
        formData.append(key, packageData[key]);
      }
    });

    const response = await api.put(`/packages/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/packages/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deactivatePackage(id) {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  }
};