import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  Stethoscope,
} from 'lucide-react';
import { Modal } from '../common/Modal.jsx';
import { Input, Textarea } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';

const commonReasons = [
  'Routine Dental Checkup & Cleaning',
  'Orthodontic Braces / Aligner Adjustment',
  'Root Canal Treatment Consultation',
  'Wisdom Tooth Extraction',
  'Teeth Whitening Session',
  'Dental Filling & Cavity Restoration',
  'Porcelain Crown / Veneer Fitting',
  'Emergency Toothache Relief',
];

const durationOptions = [
  { value: 15, label: '15 Minutes (Quick check)' },
  { value: 30, label: '30 Minutes (Standard)' },
  { value: 45, label: '45 Minutes (Extended)' },
  { value: 60, label: '60 Minutes (Procedure / Surgery)' },
  { value: 90, label: '90 Minutes (Complex Treatment)' },
];

const statusOptions = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_SHOW', label: 'No Show' },
];

export const AppointmentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  doctors = [],
  preselectedDoctor = null,
  loading = false,
  serverConflictError = null,
}) => {
  const isEdit = Boolean(initialData?.id);

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    doctorId: '',
    appointmentDate: getTomorrowDate(),
    appointmentTime: '10:00',
    durationMinutes: 30,
    reason: 'Routine Dental Checkup & Cleaning',
    notes: '',
    status: 'SCHEDULED',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const rawDate = initialData.appointmentDate;
      const formattedDate = rawDate
        ? new Date(rawDate).toISOString().split('T')[0]
        : getTomorrowDate();

      setFormData({
        patientName: initialData.patientName || '',
        patientPhone: initialData.patientPhone || '',
        patientEmail: initialData.patientEmail || '',
        doctorId: initialData.doctorId || (doctors[0]?.id ?? ''),
        appointmentDate: formattedDate,
        appointmentTime: initialData.appointmentTime || '10:00',
        durationMinutes: initialData.durationMinutes || 30,
        reason: initialData.reason || 'Routine Dental Checkup & Cleaning',
        notes: initialData.notes || '',
        status: initialData.status || 'SCHEDULED',
      });
    } else {
      setFormData({
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        doctorId: preselectedDoctor?.id || (doctors[0]?.id ?? ''),
        appointmentDate: getTomorrowDate(),
        appointmentTime: '10:00',
        durationMinutes: 30,
        reason: 'Routine Dental Checkup & Cleaning',
        notes: '',
        status: 'SCHEDULED',
      });
    }
    setErrors({});
  }, [initialData, preselectedDoctor, doctors, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const selectReason = (r) => {
    setFormData((prev) => ({ ...prev, reason: r }));
    if (errors.reason) {
      setErrors((prev) => ({ ...prev, reason: null }));
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);

  const validate = () => {
    const errs = {};
    if (!formData.patientName.trim()) errs.patientName = 'Patient name is required';
    if (!formData.patientPhone.trim()) errs.patientPhone = 'Contact phone number is required';
    if (!formData.doctorId) errs.doctorId = 'Please assign a doctor';
    if (!formData.appointmentDate) errs.appointmentDate = 'Appointment date is required';
    if (!formData.appointmentTime) errs.appointmentTime = 'Time slot is required';
    if (!formData.reason.trim()) errs.reason = 'Treatment description is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      patientName: formData.patientName.trim(),
      patientPhone: formData.patientPhone.trim(),
      patientEmail: formData.patientEmail.trim() || null,
      doctorId: formData.doctorId,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      durationMinutes: Number(formData.durationMinutes) || 30,
      reason: formData.reason.trim(),
      notes: formData.notes.trim() || null,
      status: formData.status,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Dental Appointment' : 'Book New Patient Appointment'}
      subtitle={isEdit ? `Updating appointment for ${initialData?.patientName}` : 'Schedule a dental checkup or specialist treatment'}
      maxWidth="680px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Confirm & Book Appointment'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Server Conflict Banner if triggered */}
        {serverConflictError && (
          <div
            style={{
              padding: '0.875rem 1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#b91c1c',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
              marginBottom: '1rem',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700 }}>Scheduling Conflict Detected:</div>
              <div>{serverConflictError}</div>
            </div>
          </div>
        )}

        {/* Patient Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <Input
            label="Patient Full Name"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            required
            icon={User}
            error={errors.patientName}
          />
          <Input
            label="Patient Phone Number"
            name="patientPhone"
            value={formData.patientPhone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            required
            icon={Phone}
            error={errors.patientPhone}
          />
        </div>

        <Input
          label="Patient Email (Optional)"
          name="patientEmail"
          type="email"
          value={formData.patientEmail}
          onChange={handleChange}
          placeholder="patient@example.com"
          icon={Mail}
        />

        {/* Doctor Selector */}
        <div style={{ marginTop: '0.5rem' }}>
          <Select
            label="Assign Attending Doctor"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            options={doctors.map((d) => ({
              value: d.id,
              label: `${d.name} — ${d.specialization} (${d.availableHoursStart || '09:00'} - ${d.availableHoursEnd || '17:00'}${!d.isActive ? ' - INACTIVE' : ''})`,
            }))}
            error={errors.doctorId}
            placeholder="Select a dentist..."
          />

          {selectedDoctor && (
            <div
              style={{
                marginTop: '-0.5rem',
                marginBottom: '1rem',
                padding: '0.625rem 0.875rem',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                fontSize: '0.775rem',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Stethoscope size={14} />
              <span>
                <strong>{selectedDoctor.name}</strong> • Available on: {selectedDoctor.availabilityDays?.join(', ')} ({selectedDoctor.availableHoursStart} - {selectedDoctor.availableHoursEnd})
              </span>
            </div>
          )}
        </div>

        {/* Date & Time Scheduling */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <Input
            label="Appointment Date"
            name="appointmentDate"
            type="date"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
            icon={Calendar}
            error={errors.appointmentDate}
          />
          <Input
            label="Start Time (HH:mm)"
            name="appointmentTime"
            type="time"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
            icon={Clock}
            error={errors.appointmentTime}
          />
          <Select
            label="Duration"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
            options={durationOptions}
          />
        </div>

        {/* Reason / Treatment */}
        <div style={{ marginTop: '0.5rem' }}>
          <Input
            label="Reason / Treatment"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="e.g. Toothache examination, Invisalign adjustment..."
            required
            error={errors.reason}
          />

          {/* Quick Reason Suggestions */}
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            {commonReasons.slice(0, 4).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => selectReason(r)}
                style={{
                  fontSize: '0.725rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                + {r}
              </button>
            ))}
          </div>
        </div>

        {/* Status (if editing) */}
        {isEdit && (
          <Select
            label="Appointment Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
        )}

        {/* Notes */}
        <Textarea
          label="Clinical Notes / Pre-visit Instructions"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Special requirements, dental anxiety notes, or medical history alerts..."
          rows={2}
        />
      </form>
    </Modal>
  );
};
