import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarDays,
  PlusCircle,
  Search,
  AlertCircle,
  SearchX,
  RotateCcw,
  X,
} from 'lucide-react';
import { AppointmentTable } from '../components/appointments/AppointmentTable.jsx';
import { AppointmentFormModal } from '../components/appointments/AppointmentFormModal.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { TableSkeleton } from '../components/common/Skeleton.jsx';
import { Pagination } from '../components/common/Pagination.jsx';
import { useAppointments } from '../hooks/useAppointments.js';
import { useDebounce } from '../hooks/useDebounce.js';

export const AppointmentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Custom hook for appointments data, loading, pagination, and mutations
  const {
    appointments,
    doctors,
    pagination,
    loading,
    error,
    actionLoading,
    serverConflictError,
    fetchAppointments,
    setPage,
    setLimit,
    createAppointment,
    updateAppointment,
    updateStatus,
    deleteAppointment,
    clearConflictError,
  } = useAppointments();

  // Filters initialized from URL search params if present
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 350);

  const [selectedDoctorId, setSelectedDoctorId] = useState(() => searchParams.get('doctorId') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(() => searchParams.get('status') || 'All');
  const [dateFilter, setDateFilter] = useState(() => searchParams.get('dateFilter') || (searchParams.get('date') === 'today' ? 'today' : 'All'));
  const [customDate, setCustomDate] = useState('');

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editTargetAppointment, setEditTargetAppointment] = useState(null);
  const [deleteTargetAppointment, setDeleteTargetAppointment] = useState(null);

  // Sync URL query params if user navigates with ?search= or ?dateFilter= or ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      clearConflictError();
      setIsBookModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }

    const urlDateFilter = searchParams.get('dateFilter') || (searchParams.get('date') === 'today' ? 'today' : null);
    if (urlDateFilter && urlDateFilter !== dateFilter) {
      setDateFilter(urlDateFilter);
    }
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
    }
    const urlDoctor = searchParams.get('doctorId');
    if (urlDoctor && urlDoctor !== selectedDoctorId) {
      setSelectedDoctorId(urlDoctor);
    }
  }, [searchParams, setSearchParams, clearConflictError]);

  // Build filter parameters with useCallback
  const getFilterParams = useCallback(
    (pageOverride = null) => {
      const params = {
        page: pageOverride !== null ? pageOverride : pagination.page,
        limit: pagination.limit,
      };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
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
    },
    [pagination.page, pagination.limit, debouncedSearch, selectedDoctorId, selectedStatus, dateFilter, customDate]
  );

  // Fetch when filters or page size change (resets to page 1)
  useEffect(() => {
    fetchAppointments(getFilterParams(1));
  }, [debouncedSearch, selectedDoctorId, selectedStatus, dateFilter, customDate, pagination.limit, fetchAppointments, getFilterParams]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      setPage(newPage);
      fetchAppointments(getFilterParams(newPage));
    },
    [setPage, fetchAppointments, getFilterParams]
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
    search.trim() ||
    selectedDoctorId !== 'All' ||
    selectedStatus !== 'All' ||
    dateFilter !== 'All' ||
    customDate
  );

  // Clear all filters and reset URL params
  const handleClearFilters = useCallback(() => {
    setSearch('');
    setSelectedDoctorId('All');
    setSelectedStatus('All');
    setDateFilter('All');
    setCustomDate('');
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Handle Book
  const handleCreateAppointment = useCallback(
    async (formData) => {
      const result = await createAppointment(formData, getFilterParams());
      if (result.success) {
        setIsBookModalOpen(false);
      }
    },
    [createAppointment, getFilterParams]
  );

  // Handle Edit
  const handleUpdateAppointment = useCallback(
    async (formData) => {
      if (!editTargetAppointment?.id) return;
      const result = await updateAppointment(editTargetAppointment.id, formData, getFilterParams());
      if (result.success) {
        setEditTargetAppointment(null);
      }
    },
    [editTargetAppointment, updateAppointment, getFilterParams]
  );

  // Handle Status Quick Change
  const handleStatusChange = useCallback(
    async (appointmentId, newStatus) => {
      await updateStatus(appointmentId, newStatus, getFilterParams());
    },
    [updateStatus, getFilterParams]
  );

  // Handle Delete
  const handleConfirmDelete = useCallback(
    async () => {
      if (!deleteTargetAppointment?.id) return;
      const result = await deleteAppointment(deleteTargetAppointment.id, getFilterParams());
      if (result.success) {
        setDeleteTargetAppointment(null);
      }
    },
    [deleteTargetAppointment, deleteAppointment, getFilterParams]
  );

  const handleEditClick = useCallback((apt) => {
    setEditTargetAppointment(apt);
    clearConflictError();
  }, [clearConflictError]);

  const handleDeleteClick = useCallback((apt) => {
    setDeleteTargetAppointment(apt);
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
            Appointments Schedule
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            {pagination.total} Total Patient Visit{pagination.total === 1 ? '' : 's'} Listed
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
        {/* Search with Debounce */}
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
        <TableSkeleton
          rows={6}
          columns={7}
          headers={[
            'Patient Details',
            'Attending Doctor',
            'Date & Time',
            'Duration',
            'Treatment / Reason',
            'Status',
            'Actions',
          ]}
        />
      ) : error ? (
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Appointments"
          description={error}
          actionLabel="Retry"
          onAction={() => fetchAppointments(getFilterParams())}
        />
      ) : appointments.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={SearchX}
            title="No Matching Appointments Found"
            description="No appointments matched your search and filter criteria. Try adjusting your dates, status, or search terms."
            actionLabel="Clear All Filters"
            actionIcon={RotateCcw}
            onAction={handleClearFilters}
          />
        ) : (
          <EmptyState
            icon={CalendarDays}
            title="No Appointments Scheduled"
            description="There are currently no patient appointments booked in the system."
            actionLabel="Schedule First Appointment"
            actionIcon={PlusCircle}
            onAction={() => {
              clearConflictError();
              setIsBookModalOpen(true);
            }}
          />
        )
      ) : (
        <>
          <AppointmentTable
            appointments={appointments}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onStatusChange={handleStatusChange}
          />

          {/* Pagination Controls */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[5, 10, 25, 50]}
          />
        </>
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
        itemName={
          deleteTargetAppointment
            ? `${deleteTargetAppointment.patientName} on ${new Date(deleteTargetAppointment.appointmentDate).toISOString().split('T')[0]} at ${deleteTargetAppointment.appointmentTime}`
            : ''
        }
        loading={actionLoading}
      />
    </div>
  );
};
