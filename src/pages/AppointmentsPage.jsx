import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarDays,
  PlusCircle,
  Search,
  AlertCircle,
} from 'lucide-react';
import { AppointmentTable } from '../components/appointments/AppointmentTable.jsx';
import { AppointmentFormModal } from '../components/appointments/AppointmentFormModal.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { useAppointments } from '../hooks/useAppointments.js';

export const AppointmentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Custom hook for appointments data, loading, and mutations
  const {
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
  } = useAppointments();

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dateFilter, setDateFilter] = useState('All'); // 'All' | 'today' | 'tomorrow' | 'upcoming' | 'custom'
  const [customDate, setCustomDate] = useState('');

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editTargetAppointment, setEditTargetAppointment] = useState(null);
  const [deleteTargetAppointment, setDeleteTargetAppointment] = useState(null);

  // Check URL query params for ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      clearConflictError();
      setIsBookModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, clearConflictError]);

  // Build filter parameters
  const getFilterParams = () => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (selectedDoctorId !== 'All') params.doctorId = selectedDoctorId;
    if (selectedStatus !== 'All') params.status = selectedStatus;

    const now = new Date();
    if (dateFilter === 'today') {
      params.date = now.toISOString().split('T')[0];
    } else if (dateFilter === 'tomorrow') {
      const tmrw = new Date();
      tmrw.setDate(now.getDate() + 1);
      params.date = tmrw.toISOString().split('T')[0];
    } else if (dateFilter === 'upcoming') {
      params.startDate = now.toISOString().split('T')[0];
    } else if (dateFilter === 'custom' && customDate) {
      params.date = customDate;
    }
    return params;
  };

  // Fetch when filters change
  useEffect(() => {
    fetchAppointments(getFilterParams());
  }, [search, selectedDoctorId, selectedStatus, dateFilter, customDate, fetchAppointments]);

  // Handle Book
  const handleCreateAppointment = async (formData) => {
    const result = await createAppointment(formData, getFilterParams());
    if (result.success) {
      setIsBookModalOpen(false);
    }
  };

  // Handle Edit
  const handleUpdateAppointment = async (formData) => {
    if (!editTargetAppointment?.id) return;
    const result = await updateAppointment(editTargetAppointment.id, formData, getFilterParams());
    if (result.success) {
      setEditTargetAppointment(null);
    }
  };

  // Handle Status Quick Change
  const handleStatusChange = async (appointmentId, newStatus) => {
    await updateStatus(appointmentId, newStatus, getFilterParams());
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteTargetAppointment?.id) return;
    const result = await deleteAppointment(deleteTargetAppointment.id, getFilterParams());
    if (result.success) {
      setDeleteTargetAppointment(null);
    }
  };

  return (
    <div>
      {/* Header & Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
            Appointments Schedule
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            {appointments.length} Total Patient Visit{appointments.length === 1 ? '' : 's'} Listed
          </p>
        </div>

        <Button
          onClick={() => {
            clearConflictError();
            setIsBookModalOpen(true);
          }}
          icon={PlusCircle}
        >
          Book Appointment
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1rem',
          padding: '1.25rem',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Search Patient / Reason
          </label>
          <div style={{ position: 'relative', marginTop: '4px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Name, phone, reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>
        </div>

        {/* Doctor Filter */}
        <div>
          <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Filter by Doctor
          </label>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="form-select"
            style={{ marginTop: '4px' }}
          >
            <option value="All">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialization})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-select"
            style={{ marginTop: '4px' }}
          >
            <option value="All">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Date Filter
          </label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="form-select"
            style={{ marginTop: '4px' }}
          >
            <option value="All">All Dates</option>
            <option value="today">Today Only</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="upcoming">Upcoming (Future)</option>
            <option value="custom">Specific Date...</option>
          </select>
        </div>

        {/* Specific Date input if custom */}
        {dateFilter === 'custom' && (
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Choose Date
            </label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="form-input"
              style={{ marginTop: '4px' }}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <LoadingSpinner text="Loading appointments..." />
      ) : error ? (
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Appointments"
          description={error}
          actionLabel="Retry"
          onAction={() => fetchAppointments(getFilterParams())}
        />
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No Appointments Found"
          description={
            search || selectedDoctorId !== 'All' || selectedStatus !== 'All' || dateFilter !== 'All'
              ? 'No appointments matched your search and filter criteria.'
              : 'There are currently no appointments booked.'
          }
          actionLabel="Schedule First Appointment"
          onAction={() => {
            clearConflictError();
            setIsBookModalOpen(true);
          }}
        />
      ) : (
        <AppointmentTable
          appointments={appointments}
          onEdit={(apt) => {
            setEditTargetAppointment(apt);
            clearConflictError();
          }}
          onDelete={(apt) => setDeleteTargetAppointment(apt)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Book New Appointment Modal */}
      <AppointmentFormModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          clearConflictError();
        }}
        onSubmit={handleCreateAppointment}
        doctors={doctors.filter((d) => d.isActive)}
        loading={actionLoading}
        serverConflictError={serverConflictError}
      />

      {/* Edit Appointment Modal */}
      <AppointmentFormModal
        isOpen={Boolean(editTargetAppointment)}
        onClose={() => {
          setEditTargetAppointment(null);
          clearConflictError();
        }}
        onSubmit={handleUpdateAppointment}
        initialData={editTargetAppointment}
        doctors={doctors}
        loading={actionLoading}
        serverConflictError={serverConflictError}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetAppointment)}
        onClose={() => setDeleteTargetAppointment(null)}
        onConfirm={handleConfirmDelete}
        title="Cancel & Delete Appointment"
        message="Are you sure you want to permanently cancel and delete this appointment?"
        itemName={deleteTargetAppointment ? `${deleteTargetAppointment.patientName} on ${new Date(deleteTargetAppointment.appointmentDate).toISOString().split('T')[0]} at ${deleteTargetAppointment.appointmentTime}` : ''}
        loading={actionLoading}
      />
    </div>
  );
};
