import { useState, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService.js';
import { doctorService } from '../services/doctorService.js';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Custom hook to manage Appointment schedule data, filters, and CRUD operations.
 * Extracts API logic and state management out of page components.
 */
export const useAppointments = () => {
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [serverConflictError, setServerConflictError] = useState(null);

  // Fetch appointments & doctor list
  const fetchAppointments = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const [aptsData, docsData] = await Promise.all([
        appointmentService.getAppointments(params),
        doctorService.getDoctors(),
      ]);
      setAppointments(aptsData);
      setDoctors(docsData);
      return { appointments: aptsData, doctors: docsData };
    } catch (err) {
      const msg = err.message || 'Failed to load appointments schedule';
      setError(msg);
      showToast(msg, 'error');
      return { appointments: [], doctors: [] };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Create appointment
  const createAppointment = async (payload, currentFilters = {}) => {
    setActionLoading(true);
    setServerConflictError(null);
    try {
      const created = await appointmentService.createAppointment(payload);
      showToast('Appointment successfully scheduled!', 'success');
      await fetchAppointments(currentFilters);
      return { success: true, data: created };
    } catch (err) {
      if (err.statusCode === 409) {
        setServerConflictError(err.message);
      }
      showToast(err.message || 'Failed to schedule appointment', 'error');
      return { success: false, error: err.message, isConflict: err.statusCode === 409 };
    } finally {
      setActionLoading(false);
    }
  };

  // Update appointment
  const updateAppointment = async (id, payload, currentFilters = {}) => {
    setActionLoading(true);
    setServerConflictError(null);
    try {
      const updated = await appointmentService.updateAppointment(id, payload);
      showToast('Appointment successfully updated!', 'success');
      await fetchAppointments(currentFilters);
      return { success: true, data: updated };
    } catch (err) {
      if (err.statusCode === 409) {
        setServerConflictError(err.message);
      }
      showToast(err.message || 'Failed to update appointment', 'error');
      return { success: false, error: err.message, isConflict: err.statusCode === 409 };
    } finally {
      setActionLoading(false);
    }
  };

  // Update appointment status
  const updateStatus = async (id, newStatus, currentFilters = {}) => {
    try {
      await appointmentService.updateStatus(id, newStatus);
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      await fetchAppointments(currentFilters);
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
      return { success: false, error: err.message };
    }
  };

  // Delete appointment
  const deleteAppointment = async (id, currentFilters = {}) => {
    setActionLoading(true);
    try {
      await appointmentService.deleteAppointment(id);
      showToast('Appointment cancelled and removed', 'success');
      await fetchAppointments(currentFilters);
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to delete appointment', 'error');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  const clearConflictError = () => setServerConflictError(null);

  return {
    appointments,
    doctors,
    loading,
    error,
    actionLoading,
    serverConflictError,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    updateStatus,
    deleteAppointment,
    clearConflictError,
  };
};
