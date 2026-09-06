import { api } from './api.js';

export const appointmentService = {
  /**
   * Fetch all appointments with optional filters
   */
  getAppointments: async (params = {}) => {
    const res = await api.get('/appointments', params);
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
   * Fetch single appointment details
   */
  getAppointmentById: async (id) => {
    const res = await api.get(`/appointments/${id}`);
    return res.data;
  },

  /**
   * Schedule a new appointment
   */
  createAppointment: async (appointmentData) => {
    const res = await api.post('/appointments', appointmentData);
    return res.data;
  },

  /**
   * Update an appointment
   */
  updateAppointment: async (id, appointmentData) => {
    const res = await api.put(`/appointments/${id}`, appointmentData);
    return res.data;
  },

  /**
   * Update appointment status
   */
  updateStatus: async (id, status) => {
    const res = await api.patch(`/appointments/${id}/status`, { status });
    return res.data;
  },

  /**
   * Delete an appointment
   */
  deleteAppointment: async (id) => {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
  },
};
