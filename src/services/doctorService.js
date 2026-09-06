import { api } from './api.js';

export const doctorService = {
  /**
   * Fetch all doctors with optional filtering
   */
  getDoctors: async (params = {}) => {
    const res = await api.get('/doctors', params);
    return {
      data: res.data || [],
      meta: res.meta || {
        total: res.data?.length || 0,
        count: res.data?.length || 0,
        page: 1,
        limit: res.data?.length || 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  },

  /**
   * Fetch single doctor with appointments
   */
  getDoctorById: async (id) => {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  },

  /**
   * Fetch unique doctor specializations
   */
  getSpecializations: async () => {
    const res = await api.get('/doctors/specializations');
    return res.data || [];
  },

  /**
   * Create a new doctor
   */
  createDoctor: async (doctorData) => {
    const res = await api.post('/doctors', doctorData);
    return res.data;
  },

  /**
   * Update an existing doctor
   */
  updateDoctor: async (id, doctorData) => {
    const res = await api.put(`/doctors/${id}`, doctorData);
    return res.data;
  },

  /**
   * Delete a doctor
   */
  deleteDoctor: async (id, force = false) => {
    const res = await api.delete(`/doctors/${id}`, { force });
    return res.data;
  },
};
