import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Search,
  Filter,
  LayoutGrid,
  List,
  AlertCircle,
  RefreshCw,
  Award,
  Users,
} from 'lucide-react';
import { DoctorCard } from '../components/doctors/DoctorCard.jsx';
import { DoctorTable } from '../components/doctors/DoctorTable.jsx';
import { DoctorFormModal } from '../components/doctors/DoctorFormModal.jsx';
import { DoctorDetailModal } from '../components/doctors/DoctorDetailModal.jsx';
import { AppointmentFormModal } from '../components/appointments/AppointmentFormModal.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { Button } from '../components/common/Button.jsx';
import { Select } from '../components/common/Select.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { CardSkeleton } from '../components/common/Skeleton.jsx';
import { doctorService } from '../services/doctorService.js';
import { appointmentService } from '../services/appointmentService.js';
import { useToast } from '../context/ToastContext.jsx';

export const DoctorsPage = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const [actionLoading, setActionLoading] = useState(false);
  const [serverConflictError, setServerConflictError] = useState(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedSpec !== 'All') params.specialization = selectedSpec;
      if (statusFilter !== 'All') params.isActive = statusFilter === 'active';

      const [docsData, specsData] = await Promise.all([
        doctorService.getDoctors(params),
        doctorService.getSpecializations(),
      ]);

      setDoctors(docsData);
      setSpecializations(specsData);
    } catch (err) {
      setError(err.message || 'Failed to load doctors directory');
      showToast(err.message || 'Unable to connect to doctors service', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedSpec, statusFilter, showToast]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Create Doctor
  const handleCreateDoctor = async (formData) => {
    setActionLoading(true);
    try {
      await doctorService.createDoctor(formData);
      showToast(`Dr. ${formData.name} successfully registered!`, 'success');
      setIsAddModalOpen(false);
      fetchDoctors();
    } catch (err) {
      showToast(err.message || 'Failed to create doctor record', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Doctor
  const handleUpdateDoctor = async (formData) => {
    if (!editTargetDoctor?.id) return;
    setActionLoading(true);
    try {
      await doctorService.updateDoctor(editTargetDoctor.id, formData);
      showToast(`Dr. ${formData.name} profile updated successfully`, 'success');
      setEditTargetDoctor(null);
      fetchDoctors();
    } catch (err) {
      showToast(err.message || 'Failed to update doctor profile', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Doctor
  const handleConfirmDelete = async () => {
    if (!deleteTargetDoctor?.id) return;
    setActionLoading(true);
    try {
      await doctorService.deleteDoctor(deleteTargetDoctor.id);
      showToast(`Dr. ${deleteTargetDoctor.name} removed from registry`, 'success');
      setDeleteTargetDoctor(null);
      fetchDoctors();
    } catch (err) {
      showToast(err.message || 'Cannot delete doctor with active appointments', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Book appointment with doctor from modal
  const handleBookWithDoctor = (doctor) => {
    setBookDoctorTarget(doctor);
  };

  const handleCreateAppointment = async (payload) => {
    setActionLoading(true);
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
      setActionLoading(false);
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
            onClick={() => setIsAddModalOpen(true)}
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
          onAction={fetchDoctors}
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
          onAction={() => setIsAddModalOpen(true)}
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
              onEdit={(doc) => setEditTargetDoctor(doc)}
              onDelete={(doc) => setDeleteTargetDoctor(doc)}
              onViewDetails={(doc) => setViewDoctorId(doc.id)}
            />
          ))}
        </div>
      ) : (
        <DoctorTable
          doctors={doctors}
          onEdit={(doc) => setEditTargetDoctor(doc)}
          onDelete={(doc) => setDeleteTargetDoctor(doc)}
          onViewDetails={(doc) => setViewDoctorId(doc.id)}
        />
      )}

      {/* Add Doctor Modal */}
      <DoctorFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateDoctor}
        loading={actionLoading}
      />

      {/* Edit Doctor Modal */}
      <DoctorFormModal
        isOpen={Boolean(editTargetDoctor)}
        onClose={() => setEditTargetDoctor(null)}
        onSubmit={handleUpdateDoctor}
        initialData={editTargetDoctor}
        loading={actionLoading}
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
        loading={actionLoading}
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
