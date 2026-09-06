import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Clock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard.jsx';
import { QuickActions } from '../components/dashboard/QuickActions.jsx';
import { TodaySchedule } from '../components/dashboard/TodaySchedule.jsx';
import { AppointmentTable } from '../components/appointments/AppointmentTable.jsx';
import { AppointmentFormModal } from '../components/appointments/AppointmentFormModal.jsx';
import { DoctorFormModal } from '../components/doctors/DoctorFormModal.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { DashboardSkeleton } from '../components/common/Skeleton.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Button } from '../components/common/Button.jsx';
import { useDashboard } from '../hooks/useDashboard.js';

export const DashboardPage = () => {
  const navigate = useNavigate();

  // Custom hook for all Dashboard metrics and actions
  const {
    stats,
    doctors,
    loading,
    refreshing,
    error,
    actionLoading,
    serverConflictError,
    doctorServerError,
    fetchDashboardData,
    loadDoctorsList,
    updateStatus,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    createDoctor,
    clearErrors,
  } = useDashboard();

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
  const [deleteAppointmentTarget, setDeleteAppointmentTarget] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Appointment Actions with useCallback
  const handleCreateAppointment = useCallback(
    async (payload) => {
      const result = await createAppointment(payload);
      if (result.success) {
        setIsBookModalOpen(false);
      }
    },
    [createAppointment]
  );

  const handleEditAppointment = useCallback(
    async (payload) => {
      if (!selectedAppointment?.id) return;
      const result = await updateAppointment(selectedAppointment.id, payload);
      if (result.success) {
        setIsEditAppointmentOpen(false);
        setSelectedAppointment(null);
      }
    },
    [selectedAppointment, updateAppointment]
  );

  const handleConfirmDeleteAppointment = useCallback(
    async () => {
      if (!deleteAppointmentTarget?.id) return;
      const result = await deleteAppointment(deleteAppointmentTarget.id);
      if (result.success) {
        setDeleteAppointmentTarget(null);
      }
    },
    [deleteAppointmentTarget, deleteAppointment]
  );

  // Doctor Actions with useCallback
  const handleCreateDoctor = useCallback(
    async (payload) => {
      const result = await createDoctor(payload);
      if (result.success) {
        setIsDoctorModalOpen(false);
      }
    },
    [createDoctor]
  );

  const handleOpenBookModal = useCallback(async () => {
    clearErrors();
    await loadDoctorsList();
    setIsBookModalOpen(true);
  }, [clearErrors, loadDoctorsList]);

  const handleOpenDoctorModal = useCallback(() => {
    clearErrors();
    setIsDoctorModalOpen(true);
  }, [clearErrors]);

  const handleRefresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  const handleTableEdit = useCallback((apt) => {
    setSelectedAppointment(apt);
    setIsEditAppointmentOpen(true);
  }, []);

  const handleTableDelete = useCallback((apt) => {
    setDeleteAppointmentTarget(apt);
  }, []);

  const overview = useMemo(() => stats?.overview || {}, [stats]);
  const todaySchedule = useMemo(() => stats?.todaySchedule || [], [stats]);
  const recentAppointments = useMemo(() => stats?.recentAppointments || [], [stats]);
  const topDoctors = useMemo(() => stats?.topDoctors || [], [stats]);

  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  if (error && !stats) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Unable to connect to DentPulse API"
        description={error}
        actionLabel="Retry Connection"
        onAction={() => fetchDashboardData()}
      />
    );
  }

  return (
    <div>
      {/* Quick Action Bar */}
      <QuickActions
        onBookAppointment={handleOpenBookModal}
        onAddDoctor={handleOpenDoctorModal}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* 4 Summary Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        <StatCard
          label="Total Doctors"
          value={overview.totalDoctors || 0}
          icon={Users}
          variant="primary"
          meta={`${overview.activeDoctors || 0} active on duty`}
        />
        <StatCard
          label="Today's Appointments"
          value={overview.todayAppointmentsCount || 0}
          icon={CalendarCheck}
          variant="emerald"
          meta="Visits scheduled for today"
        />
        <StatCard
          label="Upcoming Visits"
          value={overview.upcomingAppointmentsCount || 0}
          icon={Clock}
          variant="teal"
          meta="Future confirmed bookings"
        />
        <StatCard
          label="Pending Review"
          value={overview.pendingCount || 0}
          icon={AlertCircle}
          variant="amber"
          meta="Require staff confirmation"
        />
      </div>

      {/* Middle Layout: Today's Schedule & Doctors Workload */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* Today's Timeline Queue */}
        <TodaySchedule
          schedule={todaySchedule}
          onStatusChange={updateStatus}
        />

        {/* Doctors on Duty / Workload Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <ShieldCheck size={18} style={{ color: '#0ea5e9' }} />
              <span>Attending Dental Specialists</span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/doctors')}
            >
              View All
            </Button>
          </div>
          <div className="card-body">
            {topDoctors.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>
                No active doctors registered.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {topDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                        }}
                      >
                        {doc.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {doc.specialization}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: '#e0f2fe',
                          color: '#0369a1',
                        }}
                      >
                        {doc._count?.appointments || 0} Bookings
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Appointments Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent Appointments</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
              Latest patient bookings across all departments
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/appointments')}
            icon={ArrowRight}
          >
            View Full Schedule
          </Button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {recentAppointments.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              No appointments on record yet.
            </div>
          ) : (
            <AppointmentTable
              appointments={recentAppointments}
              onEdit={handleTableEdit}
              onDelete={handleTableDelete}
              onStatusChange={updateStatus}
            />
          )}
        </div>
      </div>

      {/* Book Appointment Modal */}
      <AppointmentFormModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSubmit={handleCreateAppointment}
        doctors={doctors.filter((d) => d.isActive)}
        loading={actionLoading}
        serverConflictError={serverConflictError}
      />

      {/* Edit Appointment Modal */}
      <AppointmentFormModal
        isOpen={isEditAppointmentOpen}
        onClose={() => {
          setIsEditAppointmentOpen(false);
          setSelectedAppointment(null);
        }}
        onSubmit={handleEditAppointment}
        initialData={selectedAppointment}
        doctors={doctors}
        loading={actionLoading}
        serverConflictError={serverConflictError}
      />

      {/* Add Doctor Modal */}
      <DoctorFormModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSubmit={handleCreateDoctor}
        loading={actionLoading}
        serverError={doctorServerError}
      />

      {/* Delete Appointment Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteAppointmentTarget)}
        onClose={() => setDeleteAppointmentTarget(null)}
        onConfirm={handleConfirmDeleteAppointment}
        title="Cancel Appointment"
        message="Are you sure you want to permanently cancel and delete this appointment?"
        itemName={deleteAppointmentTarget ? `${deleteAppointmentTarget.patientName}` : ''}
        loading={actionLoading}
      />
    </div>
  );
};
