import { useState, useEffect, useCallback } from 'react';
import { doctorService } from '../services/doctorService.js';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Custom hook to manage Doctor directory data, filtering, pagination, and CRUD operations.
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

  const [pagination, setPagination] = useState({
    total: 0,
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  // Load specializations once on mount
  useEffect(() => {
    doctorService
      .getSpecializations()
      .then(setSpecializations)
      .catch((err) => {
        console.warn('Could not load specializations list:', err.message);
      });
  }, []);

  // Fetch doctors list with optional query parameters and pagination
  const fetchDoctors = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          page: params.page !== undefined ? params.page : pagination.page,
          limit: params.limit !== undefined ? params.limit : pagination.limit,
          ...params,
        };

        const res = await doctorService.getDoctors(queryParams);
        const docs = Array.isArray(res) ? res : res.data || [];
        const meta = res.meta || {
          total: docs.length,
          count: docs.length,
          page: queryParams.page,
          limit: queryParams.limit,
          totalPages: Math.ceil(docs.length / queryParams.limit) || 1,
          hasNext: false,
          hasPrev: false,
        };

        setDoctors(docs);
        setPagination(meta);
        return { data: docs, meta };
      } catch (err) {
        const msg = err.message || 'Failed to load doctors list';
        setError(msg);
        showToast(msg, 'error');
        return { data: [], meta: pagination };
      } finally {
        setLoading(false);
      }
    },
    [showToast, pagination.page, pagination.limit]
  );

  // Change page
  const setPage = useCallback((newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  // Change page size
  const setLimit = useCallback((newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  // Create new doctor
  const createDoctor = async (payload, currentFilters = {}) => {
    setActionLoading(true);
    setServerError(null);
    try {
      const created = await doctorService.createDoctor(payload);
      showToast(`Dr. ${payload.name} registered successfully!`, 'success');
      await fetchDoctors(currentFilters);
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
  const updateDoctor = async (id, payload, currentFilters = {}) => {
    setActionLoading(true);
    setServerError(null);
    try {
      const updated = await doctorService.updateDoctor(id, payload);
      showToast(`Dr. ${payload.name} profile updated successfully!`, 'success');
      await fetchDoctors(currentFilters);
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
  const deleteDoctor = async (doctor, currentFilters = {}) => {
    if (!doctor?.id) return { success: false };
    setActionLoading(true);
    try {
      await doctorService.deleteDoctor(doctor.id);
      showToast(`Dr. ${doctor.name} removed from directory`, 'success');
      await fetchDoctors(currentFilters);
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
    pagination,
    loading,
    error,
    actionLoading,
    serverError,
    fetchDoctors,
    setPage,
    setLimit,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    clearServerError,
  };
};
