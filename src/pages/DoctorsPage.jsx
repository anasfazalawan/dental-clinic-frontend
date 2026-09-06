import React, { useState, useEffect, useCallback } from 'react';
import {
  UserPlus,
  Search,
  LayoutGrid,
  List,
  AlertCircle,
  Users,
  SearchX,
  RotateCcw,
  X,
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
import { DoctorCardGridSkeleton, TableSkeleton } from '../components/common/Skeleton.jsx';
import { Pagination } from '../components/common/Pagination.jsx';
import { useDoctors } from '../hooks/useDoctors.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { appointmentService } from '../services/appointmentService.js';
import { useToast } from '../context/ToastContext.jsx';

export const DoctorsPage = () => {
  const { showToast } = useToast();

  // Custom hook for Doctor CRUD, state, and pagination
  const {
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
  } = useDoctors();

  // Filters & View State
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

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

  // Helper to build filter query object
  const buildQueryParams = useCallback(
    (pageOverride = null) => {
      const params = {
        page: pageOverride !== null ? pageOverride : pagination.page,
        limit: pagination.limit,
      };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedSpec !== 'All') params.specialization = selectedSpec;
      if (statusFilter !== 'All') params.isActive = statusFilter === 'active';
      return params;
    },
    [pagination.page, pagination.limit, debouncedSearch, selectedSpec, statusFilter]
  );

  // Trigger search / filter changes (resets to page 1)
  useEffect(() => {
    fetchDoctors(buildQueryParams(1));
  }, [debouncedSearch, selectedSpec, statusFilter, pagination.limit, fetchDoctors, buildQueryParams]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      setPage(newPage);
      fetchDoctors(buildQueryParams(newPage));
    },
    [setPage, fetchDoctors, buildQueryParams]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newLimit) => {
      setLimit(newLimit);
    },
    [setLimit]
  );

  // Check if any search or filter is currently active
  const hasActiveFilters = Boolean(
    search.trim() || selectedSpec !== 'All' || statusFilter !== 'All'
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearch('');
    setSelectedSpec('All');
    setStatusFilter('All');
  }, []);

  // Handle Add Doctor
  const handleCreateDoctor = useCallback(
    async (formData) => {
      const result = await createDoctor(formData, buildQueryParams());
      if (result.success) {
        setIsAddModalOpen(false);
      }
    },
    [createDoctor, buildQueryParams]
  );

  // Handle Edit Doctor
  const handleUpdateDoctor = useCallback(
    async (formData) => {
      if (!editTargetDoctor?.id) return;
      const result = await updateDoctor(editTargetDoctor.id, formData, buildQueryParams());
      if (result.success) {
        setEditTargetDoctor(null);
      }
    },
    [editTargetDoctor, updateDoctor, buildQueryParams]
  );

  // Handle Delete Doctor
  const handleConfirmDelete = useCallback(
    async () => {
      if (!deleteTargetDoctor?.id) return;
      const result = await deleteDoctor(deleteTargetDoctor, buildQueryParams());
      if (result.success) {
        setDeleteTargetDoctor(null);
      }
    },
    [deleteTargetDoctor, deleteDoctor, buildQueryParams]
  );

  // Book appointment with doctor from modal
  const handleBookWithDoctor = useCallback((doctor) => {
    setBookDoctorTarget(doctor);
    setServerConflictError(null);
  }, []);

  const handleCreateAppointment = useCallback(
    async (payload) => {
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
    },
    [showToast]
  );

  const handleEditClick = useCallback(
    (doc) => {
      clearServerError();
      setEditTargetDoctor(doc);
    },
    [clearServerError]
  );

  const handleDeleteClick = useCallback((doc) => {
    setDeleteTargetDoctor(doc);
  }, []);

  const handleViewDetailsClick = useCallback((docIdOrDoc) => {
    const id = typeof docIdOrDoc === 'string' ? docIdOrDoc : docIdOrDoc?.id;
    setViewDoctorId(id);
  }, []);

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
            {pagination.total} Registered Dental Specialist{pagination.total === 1 ? '' : 's'}
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
        {/* Search with Debounce */}
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
              style={{ paddingLeft: '38px', paddingRight: search ? '36px' : '12px' }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Clear search"
                aria-label="Clear search input"
              >
                <X size={14} />
              </button>
            )}
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
        viewMode === 'grid' ? (
          <DoctorCardGridSkeleton count={6} />
        ) : (
          <TableSkeleton
            rows={6}
            columns={7}
            headers={[
              'Doctor Name',
              'Specialization',
              'Availability',
              'Working Hours',
              'Contact',
              'Status',
              'Actions',
            ]}
          />
        )
      ) : error ? (
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Doctors"
          description={error}
          actionLabel="Retry"
          onAction={() => fetchDoctors(buildQueryParams())}
        />
      ) : doctors.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={SearchX}
            title="No Matching Doctors Found"
            description="No doctors match your current search and filter criteria. Try clearing your filters or searching with different terms."
            actionLabel="Clear All Filters"
            actionIcon={RotateCcw}
            onAction={handleClearFilters}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No Doctors Registered"
            description="No doctors are currently in the system. Get started by registering your first dental specialist."
            actionLabel="Register First Doctor"
            actionIcon={UserPlus}
            onAction={() => {
              clearServerError();
              setIsAddModalOpen(true);
            }}
          />
        )
      ) : (
        <>
          {viewMode === 'grid' ? (
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
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onViewDetails={handleViewDetailsClick}
                />
              ))}
            </div>
          ) : (
            <DoctorTable
              doctors={doctors}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onViewDetails={handleViewDetailsClick}
            />
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[6, 12, 24, 48]}
          />
        </>
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
