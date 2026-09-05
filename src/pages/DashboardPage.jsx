import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity,
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
import { dashboardService } from '../services/dashboardService.js';
import { appointmentService } from '../services/appointmentService.js';
import { doctorService } from '../services/doctorService.js';
import { useToast } from '../context/ToastContext.jsx';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
  const [deleteAppointmentTarget, setDeleteAppointmentTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [serverConflictError, setServerConflictError] = useState(null);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [statsData, doctorsData] = await Promise.all([
        dashboardService.getStats(),
        doctorService.getDoctors(),
      ]);
      setStats(statsData);
      setDoctors(doctorsData);
      if (isRefresh) {
        showToast('Dashboard metrics updated successfully', 'success');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      showToast(err.message || 'Failed to connect to API server', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Seed Data Handler
  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await dashboardService.seedData();
      showToast('Database successfully seeded with realistic clinic data!', 'success');
      fetchDashboardData(true);
    } catch (err) {
      showToast(err.message || 'Failed to seed database', 'error');
    } finally {
      setSeeding(false);
    }
  };

  // Appointment Status Change
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateStatus(appointmentId, newStatus);
      showToast(`Status updated to ${newStatus}`, 'success');
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Create Appointment
  const handleCreateAppointment = async (payload) => {
    setActionLoading(true);
    setServerConflictError(null);
    try {
      await appointmentService.createAppointment(payload);
      showToast('Appointment successfully scheduled!', 'success');
      setIsBookModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      if (err.statusCode === 409) {
        setServerConflictError(err.message);
      }
      showToast(err.message || 'Failed to schedule appointment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Appointment
  const handleEditAppointment = async (payload) => {
    if (!selectedAppointment?.id) return;
    setActionLoading(true);
    setServerConflictError(null);
    try {
      await appointmentService.updateAppointment(selectedAppointment.id, payload);
      showToast('Appointment updated successfully', 'success');
      setIsEditAppointmentOpen(false);
      setSelectedAppointment(null);
      fetchDashboardData();
    } catch (err) {
      if (err.statusCode === 409) {
        setServerConflictError(err.message);
      }
      showToast(err.message || 'Failed to update appointment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Appointment
  const handleConfirmDeleteAppointment = async () => {
    if (!deleteAppointmentTarget?.id) return;
    setActionLoading(true);
    try {
      await appointmentService.deleteAppointment(deleteAppointmentTarget.id);
      showToast('Appointment deleted successfully', 'success');
      setDeleteAppointmentTarget(null);
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to delete appointment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Create Doctor
  const handleCreateDoctor = async (payload) => {
    setActionLoading(true);
    try {
      await doctorService.createDoctor(payload);
      showToast(`Dr. ${payload.name} added successfully!`, 'success');
      setIsDoctorModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to create doctor', 'error');
    } finally {
      setActionLoading(false);
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
  const statusBreakdown = stats?.statusBreakdown || {};

  return (
    <div>
      {/* Quick Action Bar */}
      <QuickActions
        onBookAppointment={() => {
          setServerConflictError(null);
          setIsBookModalOpen(true);
        }}
        onAddDoctor={() => setIsDoctorModalOpen(true)}
        onRefresh={() => fetchDashboardData(true)}
        onSeedData={handleSeedData}
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
          onStatusChange={handleStatusChange}
          onBookAppointment={() => setIsBookModalOpen(true)}
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
                onAction={() => setIsBookModalOpen(true)}
              />
            </div>
          ) : (
            <AppointmentTable
              appointments={stats?.recentAppointments || []}
              onEdit={(apt) => {
                setSelectedAppointment(apt);
                setServerConflictError(null);
                setIsEditAppointmentOpen(true);
              }}
              onDelete={(apt) => setDeleteAppointmentTarget(apt)}
              onStatusChange={handleStatusChange}
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
