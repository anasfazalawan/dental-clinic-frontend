import { useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService.js';
import { appointmentService } from '../services/appointmentService.js';
import { doctorService } from '../services/doctorService.js';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Custom hook to manage Dashboard metrics, schedule timeline, and quick actions.
 * Keeps DashboardPage lean and component-focused.
 */
export const useDashboard = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [serverConflictError, setServerConflictError] = useState(null);
  const [doctorServerError, setDoctorServerError] = useState(null);

  // Fetch dashboard summary metrics
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const statsData = await dashboardService.getStats();
      setStats(statsData);
      if (isRefresh) {
        showToast('Dashboard metrics refreshed successfully', 'success');
      }
      return statsData;
    } catch (err) {
      const msg = err.message || 'Failed to fetch dashboard data';
      setError(msg);
      showToast(msg, 'error');
      return null;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  // Load doctors list on demand
  const loadDoctorsList = async () => {
    if (doctors.length === 0) {
      try {
        const docs = await doctorService.getDoctors();
        setDoctors(docs);
        return docs;
      } catch (err) {
        console.warn('Failed to load doctors list:', err.message);
        return [];
      }
    }
    return doctors;
  };

  // Seed database
  const seedDatabase = async () => {
    setSeeding(true);
    try {
      await dashboardService.seedData();
      showToast('Database reset with sample clinic records', 'success');
      await fetchDashboardData(true);
      const docs = await doctorService.getDoctors();
      setDoctors(docs);
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to seed database', 'error');
      return { success: false, error: err.message };
    } finally {
      setSeeding(false);
    }
  };

  // Status Change
  const updateStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateStatus(appointmentId, newStatus);
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
      return { success: false, error: err.message };
    }
  };

  // Create Appointment
  const createAppointment = async (payload) => {
    setActionLoading(true);
    setServerConflictError(null);
    try {
      await appointmentService.createAppointment(payload);
      showToast('Appointment scheduled successfully!', 'success');
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      if (err.statusCode === 409) {
        setServerConflictError(err.message);
      }
      showToast(err.message || 'Failed to schedule appointment', 'error');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  // Update Appointment
  const updateAppointment = async (id, payload) => {
    setActionLoading(true);
    setServerConflictError(null);
    try {
      await appointmentService.updateAppointment(id, payload);
      showToast('Appointment updated successfully', 'success');
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      if (err.statusCode === 409) {
        setServerConflictError(err.message);
      }
      showToast(err.message || 'Failed to update appointment', 'error');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Appointment
  const deleteAppointment = async (id) => {
    setActionLoading(true);
    try {
      await appointmentService.deleteAppointment(id);
      showToast('Appointment deleted successfully', 'success');
      await fetchDashboardData();
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to delete appointment', 'error');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  // Create Doctor
  const createDoctor = async (payload) => {
    setActionLoading(true);
    setDoctorServerError(null);
    try {
      await doctorService.createDoctor(payload);
      showToast(`Dr. ${payload.name} added successfully!`, 'success');
      await fetchDashboardData();
      const docs = await doctorService.getDoctors();
      setDoctors(docs);
      return { success: true };
    } catch (err) {
      setDoctorServerError(err.message);
      showToast(err.message || 'Failed to create doctor', 'error');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  };

  const clearErrors = () => {
    setServerConflictError(null);
    setDoctorServerError(null);
  };

  return {
    stats,
    doctors,
    loading,
    refreshing,
    seeding,
    error,
    actionLoading,
    serverConflictError,
    doctorServerError,
    fetchDashboardData,
    loadDoctorsList,
    seedDatabase,
    updateStatus,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    createDoctor,
    clearErrors,
  };
};
