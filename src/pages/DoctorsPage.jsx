import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Search,
  LayoutGrid,
  List,
  AlertCircle,
  Users,
} from 'lucide-react';
import { DoctorCard } from '../components/doctors/DoctorCard.jsx';
import { DoctorTable } from '../components/doctors/DoctorTable.jsx';
import { DoctorFormModal } from '../components/doctors/DoctorFormModal.jsx';
import { DoctorDetailModal } from '../components/doctors/DoctorDetailModal.jsx';
import { AppointmentFormModal } from '../components/appointments/AppointmentFormModal.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { useDoctors } from '../hooks/useDoctors.js';
import { appointmentService } from '../services/appointmentService.js';
import { useToast } from '../context/ToastContext.jsx';

export const DoctorsPage = () => {
  const { showToast } = useToast();

  // Custom hook for Doctor CRUD and state
  const {
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
  } = useDoctors();

  // Filters & View State
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTargetDoctor, setEditTargetDoctor] = useState(null);
  const [viewDoctorId, setViewDoctorId] = useState(null);
  const [deleteTargetDoctor, setDeleteTargetDoctor] = useState(null);
  const [bookDoctorTarget, setBookDoctorTarget] = useState(null);
  const [serverConflictError, setServerConflictError] = useState(null);
  const [appointmentActionLoading, setAppointmentActionLoading] = useState(false);

  // Trigger search / filter changes
  useEffect(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (selectedSpec !== 'All') params.specialization = selectedSpec;
    if (statusFilter !== 'All') params.isActive = statusFilter === 'active';

    fetchDoctors(params);
  }, [search, selectedSpec, statusFilter, fetchDoctors]);

  // Handle Add Doctor
  const handleCreateDoctor = async (formData) => {
    const result = await createDoctor(formData);
    if (result.success) {
      setIsAddModalOpen(false);
    }
  };

  // Handle Edit Doctor
  const handleUpdateDoctor = async (formData) => {
    if (!editTargetDoctor?.id) return;
    const result = await updateDoctor(editTargetDoctor.id, formData);
    if (result.success) {
      setEditTargetDoctor(null);
    }
  };

  // Handle Delete Doctor
  const handleConfirmDelete = async () => {
    if (!deleteTargetDoctor?.id) return;
    const result = await deleteDoctor(deleteTargetDoctor);
    if (result.success) {
      setDeleteTargetDoctor(null);
    }
  };

  // Book appointment with doctor from modal
  const handleBookWithDoctor = (doctor) => {
    setBookDoctorTarget(doctor);
    setServerConflictError(null);
  };

  const handleCreateAppointment = async (payload) => {
    setAppointmentActionLoading(true);
    setServerConflictError(null);
    try {
      await appointmentService.createAppointment(payload);
      showToast('Appointment successfully scheduled!', 'success');
      setBookDoctorTarget(null);
    } catch (err) {
      if (err.statusCode === 409) {
        setServerConflictError(err.message);
      }
      showToast(err.message || 'Failed to schedule appointment', 'error');
    } finally {
      setAppointmentActionLoading(false);
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
            Doctors Directory
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            {doctors.length} Registered Dental Specialist{doctors.length === 1 ? '' : 's'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* View Toggle */}
          <div
            style={{
              display: 'flex',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '2px',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                border: 'none',
                background: viewMode === 'grid' ? '#e0f2fe' : 'transparent',
                color: viewMode === 'grid' ? '#0284c7' : '#64748b',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                border: 'none',
                background: viewMode === 'table' ? '#e0f2fe' : 'transparent',
                color: viewMode === 'table' ? '#0284c7' : '#64748b',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Table View"
              aria-label="Table view"
            >
              <List size={16} />
            </button>
          </div>

          <Button
            onClick={() => {
              clearServerError();
              setIsAddModalOpen(true);
            }}
            icon={UserPlus}
          >
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
            Search Doctors
          </label>
          <div style={{ position: 'relative', marginTop: '4px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>
        </div>

        {/* Specialization Filter */}
        <div>
          <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Specialization
          </label>
          <select
            value={selectedSpec}
            onChange={(e) => setSelectedSpec(e.target.value)}
            className="form-select"
            style={{ marginTop: '4px' }}
          >
            <option value="All">All Specializations</option>
            {specializations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Practice Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ marginTop: '4px' }}
          >
            <option value="All">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner text="Loading doctors..." />
      ) : error ? (
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Doctors"
          description={error}
          actionLabel="Retry"
          onAction={() => fetchDoctors()}
        />
      ) : doctors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Doctors Found"
          description={
            search || selectedSpec !== 'All' || statusFilter !== 'All'
              ? 'No doctors match your current search and filter criteria.'
              : 'No doctors are currently in the system.'
          }
          actionLabel="Register First Doctor"
          onAction={() => {
            clearServerError();
            setIsAddModalOpen(true);
          }}
        />
      ) : viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={(doc) => {
                clearServerError();
                setEditTargetDoctor(doc);
              }}
              onDelete={(doc) => setDeleteTargetDoctor(doc)}
              onViewDetails={(doc) => setViewDoctorId(doc.id)}
            />
          ))}
        </div>
      ) : (
        <DoctorTable
          doctors={doctors}
          onEdit={(doc) => {
            clearServerError();
            setEditTargetDoctor(doc);
          }}
          onDelete={(doc) => setDeleteTargetDoctor(doc)}
          onViewDetails={(doc) => setViewDoctorId(doc.id)}
        />
      )}

      {/* Add Doctor Modal */}
      <DoctorFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          clearServerError();
        }}
        onSubmit={handleCreateDoctor}
        loading={actionLoading}
        serverError={serverError}
      />

      {/* Edit Doctor Modal */}
      <DoctorFormModal
        isOpen={Boolean(editTargetDoctor)}
        onClose={() => {
          setEditTargetDoctor(null);
          clearServerError();
        }}
        onSubmit={handleUpdateDoctor}
        initialData={editTargetDoctor}
        loading={actionLoading}
        serverError={serverError}
      />

      {/* View Doctor Profile / Schedule Modal */}
      <DoctorDetailModal
        isOpen={Boolean(viewDoctorId)}
        onClose={() => setViewDoctorId(null)}
        doctorId={viewDoctorId}
        onBookWithDoctor={handleBookWithDoctor}
      />

      {/* Book with Doctor Modal */}
      <AppointmentFormModal
        isOpen={Boolean(bookDoctorTarget)}
        onClose={() => setBookDoctorTarget(null)}
        onSubmit={handleCreateAppointment}
        doctors={doctors}
        preselectedDoctor={bookDoctorTarget}
        loading={appointmentActionLoading}
        serverConflictError={serverConflictError}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetDoctor)}
        onClose={() => setDeleteTargetDoctor(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Doctor Profile"
        message="Are you sure you want to remove this doctor from the registry? Active future appointments must be reassigned or cancelled first."
        itemName={deleteTargetDoctor ? `${deleteTargetDoctor.name} (${deleteTargetDoctor.specialization})` : ''}
        loading={actionLoading}
      />
    </div>
  );
};
