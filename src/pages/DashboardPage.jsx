import React, { useState, useEffect } from 'react';
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

  // Appointment Actions
  const handleCreateAppointment = async (payload) => {
    const result = await createAppointment(payload);
    if (result.success) {
      setIsBookModalOpen(false);
    }
  };

  const handleEditAppointment = async (payload) => {
    if (!selectedAppointment?.id) return;
    const result = await updateAppointment(selectedAppointment.id, payload);
    if (result.success) {
      setIsEditAppointmentOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleConfirmDeleteAppointment = async () => {
    if (!deleteAppointmentTarget?.id) return;
    const result = await deleteAppointment(deleteAppointmentTarget.id);
    if (result.success) {
      setDeleteAppointmentTarget(null);
    }
  };

  // Doctor Actions
  const handleCreateDoctor = async (payload) => {
    const result = await createDoctor(payload);
    if (result.success) {
      setIsDoctorModalOpen(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading clinic dashboard..." fullPage />;
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

  const overview = stats?.overview || {};

  return (
    <div>
      {/* Quick Action Bar */}
      <QuickActions
        onBookAppointment={async () => {
          clearErrors();
          await loadDoctorsList();
          setIsBookModalOpen(true);
        }}
        onAddDoctor={() => {
          clearErrors();
          setIsDoctorModalOpen(true);
        }}
        onRefresh={() => fetchDashboardData(true)}
        onSeedData={seedDatabase}
        refreshing={refreshing}
        seeding={seeding}
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
          meta={`${overview.activeDoctors || 0} active specialists`}
        />
        <StatCard
          label="Today's Appointments"
          value={overview.todayAppointmentsCount || 0}
          icon={Clock}
          variant="emerald"
          meta="Scheduled for today"
        />
        <StatCard
          label="Upcoming Visits"
          value={overview.upcomingAppointmentsCount || 0}
          icon={CalendarCheck}
          variant="teal"
          meta="Future confirmed bookings"
        />
        <StatCard
          label="Pending Review"
          value={overview.pendingCount || 0}
          icon={AlertCircle}
          variant="amber"
          meta="Awaiting confirmation"
        />
      </div>

      {/* Main Grid: Today's Schedule & Doctor Workload */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Today's Schedule Timeline */}
        <TodaySchedule
          schedule={stats?.todaySchedule || []}
          onStatusChange={updateStatus}
          onBookAppointment={async () => {
            clearErrors();
            await loadDoctorsList();
            setIsBookModalOpen(true);
          }}
        />

        {/* Doctors on Duty / Workload Widget */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <ShieldCheck size={18} style={{ color: '#0ea5e9' }} />
              <span>Doctors on Duty</span>
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/doctors')}
            >
              View All Doctors
            </Button>
          </div>
          <div className="card-body">
            {stats?.topDoctors?.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                No active doctors configured yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {stats?.topDoctors?.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.625rem 0.875rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#e0f2fe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: '#0369a1',
                          fontSize: '0.85rem',
                          flexShrink: 0,
                        }}
                      >
                        {doc.avatarUrl ? (
                          <img
                            src={doc.avatarUrl}
                            alt={doc.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          doc.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#0284c7' }}>
                          {doc.specialization}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: '#e0f2fe',
                          color: '#0369a1',
                        }}
                      >
                        {doc._count?.appointments || 0} Bookings
                      </span>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                        {doc.availableHoursStart} - {doc.availableHoursEnd}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Appointments Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent Appointments</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
              Latest patient booking requests and scheduled procedures
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/appointments')}
            icon={ArrowRight}
          >
            All Appointments
          </Button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {stats?.recentAppointments?.length === 0 ? (
            <div style={{ padding: '2rem' }}>
              <EmptyState
                title="No Appointments Scheduled"
                description="Click 'Book Appointment' to schedule your first patient visit."
                actionLabel="Book Appointment"
                onAction={async () => {
                  clearErrors();
                  await loadDoctorsList();
                  setIsBookModalOpen(true);
                }}
              />
            </div>
          ) : (
            <AppointmentTable
              appointments={stats?.recentAppointments || []}
              onEdit={async (apt) => {
                clearErrors();
                await loadDoctorsList();
                setSelectedAppointment(apt);
                setIsEditAppointmentOpen(true);
              }}
              onDelete={(apt) => setDeleteAppointmentTarget(apt)}
              onStatusChange={updateStatus}
            />
          )}
        </div>
      </div>

      {/* Book Appointment Modal */}
      <AppointmentFormModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          clearErrors();
        }}
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
          clearErrors();
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
        onClose={() => {
          setIsDoctorModalOpen(false);
          clearErrors();
        }}
        onSubmit={handleCreateDoctor}
        loading={actionLoading}
        serverError={doctorServerError}
      />

      {/* Delete Appointment Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteAppointmentTarget)}
        onClose={() => setDeleteAppointmentTarget(null)}
        onConfirm={handleConfirmDeleteAppointment}
        title="Delete Appointment"
        message="Are you sure you want to permanently cancel and delete this appointment?"
        itemName={deleteAppointmentTarget ? `${deleteAppointmentTarget.patientName} (${deleteAppointmentTarget.reason})` : ''}
        loading={actionLoading}
      />
    </div>
  );
};
