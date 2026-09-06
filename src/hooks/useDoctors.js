import { useState, useEffect, useCallback } from 'react';
import { doctorService } from '../services/doctorService.js';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Custom hook to manage Doctor directory data, filtering, and CRUD operations.
 * Extracts state and API management out of the page component.
 */
export const useDoctors = (initialFilters = {}) => {
  const { showToast } = useToast();

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Load specializations once on mount
  useEffect(() => {
    doctorService
      .getSpecializations()
      .then(setSpecializations)
      .catch((err) => {
        console.warn('Could not load specializations list:', err.message);
      });
  }, []);

  // Fetch doctors list with optional query parameters
  const fetchDoctors = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await doctorService.getDoctors(params);
      setDoctors(data);
      return data;
    } catch (err) {
      const msg = err.message || 'Failed to load doctors list';
      setError(msg);
      showToast(msg, 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Create new doctor
  const createDoctor = async (payload) => {
    setActionLoading(true);
    setServerError(null);
    try {
      const created = await doctorService.createDoctor(payload);
      showToast(`Dr. ${payload.name} registered successfully!`, 'success');
      await fetchDoctors();
      return { success: true, data: created };
    } catch (err) {
      setServerError(err.message);
      showToast(err.message || 'Failed to create doctor profile', 'error');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  // Update existing doctor
  const updateDoctor = async (id, payload) => {
    setActionLoading(true);
    setServerError(null);
    try {
      const updated = await doctorService.updateDoctor(id, payload);
      showToast(`Dr. ${payload.name} profile updated successfully!`, 'success');
      await fetchDoctors();
      return { success: true, data: updated };
    } catch (err) {
      setServerError(err.message);
      showToast(err.message || 'Failed to update doctor profile', 'error');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  // Delete doctor
  const deleteDoctor = async (doctor) => {
    if (!doctor?.id) return { success: false };
    setActionLoading(true);
    try {
      await doctorService.deleteDoctor(doctor.id);
      showToast(`Dr. ${doctor.name} removed from directory`, 'success');
      await fetchDoctors();
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Cannot delete doctor with active appointments', 'error');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  const clearServerError = () => setServerError(null);

  return {
    doctors,
    specializations,
    loading,
    error,
    actionLoading,
    serverError,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    clearServerError,
  };
};
