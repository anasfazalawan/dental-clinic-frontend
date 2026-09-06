import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertTriangle,
  Stethoscope,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Modal } from '../common/Modal.jsx';
import { Input, Textarea } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';
import { appointmentService } from '../../services/appointmentService.js';

// Predefined Clinical Treatment Procedures
const PREDEFINED_REASONS = [
  'Routine Dental Checkup & Cleaning',
  'Orthodontic Braces / Aligner Adjustment',
  'Root Canal Treatment Consultation',
  'Wisdom Tooth Extraction',
  'Teeth Whitening Session',
  'Dental Filling & Cavity Restoration',
  'Porcelain Crown / Veneer Fitting',
  'Periodontal Gum Disease Therapy',
  'Dental Implant Consultation',
  'Emergency Toothache Relief',
  'Other (Custom Reason)',
];

const durationOptions = [
  { value: 15, label: '15 Minutes (Quick follow-up)' },
  { value: 30, label: '30 Minutes (Standard consultation / cleaning)' },
  { value: 45, label: '45 Minutes (Extended procedure)' },
  { value: 60, label: '60 Minutes (Full surgery / root canal)' },
  { value: 90, label: '90 Minutes (Complex cosmetic / implant)' },
];

const statusOptions = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_SHOW', label: 'No Show' },
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to convert "HH:mm" to minutes from midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map((n) => parseInt(n, 10));
  return (h || 0) * 60 + (m || 0);
};

// Helper to convert minutes to "HH:mm"
const minutesToTime = (totalMinutes) => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

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
    appointmentTime: '09:00',
    durationMinutes: 30,
    reasonSelect: 'Routine Dental Checkup & Cleaning',
    customReason: '',
    notes: '',
    status: 'SCHEDULED',
  });

  const [errors, setErrors] = useState({});
  const [existingBookings, setExistingBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Initialize or reset form state when modal opens
  useEffect(() => {
    if (initialData) {
      const rawDate = initialData.appointmentDate;
      const formattedDate = rawDate
        ? new Date(rawDate).toISOString().split('T')[0]
        : getTomorrowDate();

      const isPreset = PREDEFINED_REASONS.includes(initialData.reason);

      setFormData({
        patientName: initialData.patientName || '',
        patientPhone: initialData.patientPhone || '',
        patientEmail: initialData.patientEmail || '',
        doctorId: initialData.doctorId || (doctors[0]?.id ?? ''),
        appointmentDate: formattedDate,
        appointmentTime: initialData.appointmentTime || '09:00',
        durationMinutes: initialData.durationMinutes || 30,
        reasonSelect: isPreset ? initialData.reason : 'Other (Custom Reason)',
        customReason: isPreset ? '' : initialData.reason || '',
        notes: initialData.notes || '',
        status: initialData.status || 'SCHEDULED',
      });
    } else {
      const defaultDoc = preselectedDoctor || doctors[0] || null;
      const defaultTime = defaultDoc?.availableHoursStart || '09:00';

      setFormData({
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        doctorId: defaultDoc?.id || '',
        appointmentDate: getTomorrowDate(),
        appointmentTime: defaultTime,
        durationMinutes: 30,
        reasonSelect: 'Routine Dental Checkup & Cleaning',
        customReason: '',
        notes: '',
        status: 'SCHEDULED',
      });
    }
    setErrors({});
  }, [initialData, preselectedDoctor, doctors, isOpen]);

  // Selected doctor object
  const selectedDoctor = useMemo(() => {
    return doctors.find((d) => d.id === formData.doctorId) || null;
  }, [doctors, formData.doctorId]);

  // Determine weekday name for current picked date
  const selectedWeekday = useMemo(() => {
    if (!formData.appointmentDate) return null;
    const parts = formData.appointmentDate.split('-').map(Number);
    // Use UTC date constructor to avoid timezone drift
    const dateObj = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    return DAYS_OF_WEEK[dateObj.getUTCDay()];
  }, [formData.appointmentDate]);

  // Check if doctor works on the selected day
  const isDoctorAvailableOnDay = useMemo(() => {
    if (!selectedDoctor || !selectedWeekday) return true;
    if (!Array.isArray(selectedDoctor.availabilityDays) || selectedDoctor.availabilityDays.length === 0) {
      return true;
    }
    return selectedDoctor.availabilityDays.includes(selectedWeekday);
  }, [selectedDoctor, selectedWeekday]);

  // Fetch existing appointments for the selected doctor and date to detect booked slots
  useEffect(() => {
    if (!isOpen || !formData.doctorId || !formData.appointmentDate) {
      setExistingBookings([]);
      return;
    }

    let isMounted = true;
    setLoadingBookings(true);

    appointmentService
      .getAppointments({
        doctorId: formData.doctorId,
        date: formData.appointmentDate,
      })
      .then((res) => {
        if (!isMounted) return;
        const apts = Array.isArray(res) ? res : res.data || [];
        // Exclude cancelled and no-show bookings, as well as the appointment currently being edited
        const activeBookings = apts.filter(
          (a) =>
            !['CANCELLED', 'NO_SHOW'].includes(a.status?.toUpperCase()) &&
            (!initialData || a.id !== initialData.id)
        );
        setExistingBookings(activeBookings);
      })
      .catch((err) => {
        console.warn('Could not fetch doctor schedule:', err.message);
        if (isMounted) setExistingBookings([]);
      })
      .finally(() => {
        if (isMounted) setLoadingBookings(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, formData.doctorId, formData.appointmentDate, initialData]);

  // Generate available and booked time slots dynamically
  const generatedSlots = useMemo(() => {
    if (!selectedDoctor) return [];

    const startMinutes = timeToMinutes(selectedDoctor.availableHoursStart || '09:00');
    const endMinutes = timeToMinutes(selectedDoctor.availableHoursEnd || '17:00');
    const duration = Number(formData.durationMinutes) || 30;

    const slots = [];
    const step = 30; // 30-minute interval grid

    for (let current = startMinutes; current + duration <= endMinutes; current += step) {
      const slotTime = minutesToTime(current);
      const slotStart = current;
      const slotEnd = current + duration;

      // Check collision with existing active bookings
      let conflictingPatient = null;
      const isBooked = existingBookings.some((apt) => {
        const aptStart = timeToMinutes(apt.appointmentTime);
        const aptEnd = aptStart + (apt.durationMinutes || 30);
        const overlaps = slotStart < aptEnd && slotEnd > aptStart;
        if (overlaps) {
          conflictingPatient = apt.patientName;
        }
        return overlaps;
      });

      slots.push({
        time: slotTime,
        label: slotTime,
        isBooked,
        bookedBy: conflictingPatient,
      });
    }

    return slots;
  }, [selectedDoctor, formData.durationMinutes, existingBookings]);

  // Auto-adjust appointmentTime if selected slot is booked or out of range
  useEffect(() => {
    if (generatedSlots.length > 0) {
      const currentSelectedSlot = generatedSlots.find((s) => s.time === formData.appointmentTime);
      if (!currentSelectedSlot || currentSelectedSlot.isBooked) {
        const firstAvailable = generatedSlots.find((s) => !s.isBooked);
        if (firstAvailable) {
          setFormData((prev) => ({ ...prev, appointmentTime: firstAvailable.time }));
        }
      }
    }
  }, [generatedSlots, formData.appointmentTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Select a generated time slot
  const handleSelectSlot = (slot) => {
    if (slot.isBooked) return;
    setFormData((prev) => ({ ...prev, appointmentTime: slot.time }));
    if (errors.appointmentTime) {
      setErrors((prev) => ({ ...prev, appointmentTime: null }));
    }
  };

  // Comprehensive Frontend-First Validation
  const validate = () => {
    const errs = {};

    // 1. Patient Name
    if (!formData.patientName.trim()) {
      errs.patientName = 'Patient full name is required';
    } else if (formData.patientName.trim().length < 2) {
      errs.patientName = 'Name must be at least 2 characters';
    }

    // 2. Patient Phone
    const phoneRegex = /^[\d\s\+\-\(\)\.]{7,25}$/;
    if (!formData.patientPhone.trim()) {
      errs.patientPhone = 'Contact phone number is required';
    } else if (!phoneRegex.test(formData.patientPhone.trim())) {
      errs.patientPhone = 'Please enter a valid phone number (e.g. +1 555-019-2831)';
    }

    // 3. Patient Email (optional, but validate format if present)
    if (formData.patientEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.patientEmail.trim())) {
        errs.patientEmail = 'Please enter a valid email address';
      }
    }

    // 4. Doctor Selection
    if (!formData.doctorId) {
      errs.doctorId = 'Please assign an attending doctor';
    } else if (selectedDoctor && !selectedDoctor.isActive) {
      errs.doctorId = 'This doctor is currently inactive and cannot accept bookings';
    }

    // 5. Date Validation & Doctor Working Day Check
    if (!formData.appointmentDate) {
      errs.appointmentDate = 'Appointment date is required';
    } else if (!isDoctorAvailableOnDay) {
      errs.appointmentDate = `Dr. ${selectedDoctor?.name || 'Doctor'} is not available on ${selectedWeekday}s. Available days: ${selectedDoctor?.availabilityDays?.join(', ')}`;
    }

    // 6. Time Slot Validation
    if (!formData.appointmentTime) {
      errs.appointmentTime = 'Please select an appointment time slot';
    } else {
      const chosenSlot = generatedSlots.find((s) => s.time === formData.appointmentTime);
      if (chosenSlot && chosenSlot.isBooked) {
        errs.appointmentTime = `The ${formData.appointmentTime} time slot is already booked. Please choose an available slot.`;
      }
    }

    // 7. Reason / Treatment Validation
    if (formData.reasonSelect === 'Other (Custom Reason)') {
      if (!formData.customReason.trim()) {
        errs.customReason = 'Please specify the custom treatment reason';
      } else if (formData.customReason.trim().length < 3) {
        errs.customReason = 'Custom reason must be at least 3 characters';
      }
    } else if (!formData.reasonSelect) {
      errs.reasonSelect = 'Please select a treatment reason';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalReason =
      formData.reasonSelect === 'Other (Custom Reason)'
        ? formData.customReason.trim()
        : formData.reasonSelect;

    onSubmit({
      patientName: formData.patientName.trim(),
      patientPhone: formData.patientPhone.trim(),
      patientEmail: formData.patientEmail.trim() || null,
      doctorId: formData.doctorId,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      durationMinutes: Number(formData.durationMinutes) || 30,
      reason: finalReason,
      notes: formData.notes.trim() || null,
      status: formData.status,
    });
  };

  const availableSlotsCount = generatedSlots.filter((s) => !s.isBooked).length;
  const bookedSlotsCount = generatedSlots.filter((s) => s.isBooked).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Dental Appointment' : 'Book New Patient Appointment'}
      subtitle={
        isEdit
          ? `Updating appointment for ${initialData?.patientName}`
          : 'Schedule a dental checkup with conflict-free slot selection'
      }
      maxWidth="720px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!isDoctorAvailableOnDay || (generatedSlots.length > 0 && availableSlotsCount === 0)}
          >
            {isEdit ? 'Save Changes' : 'Confirm & Book Appointment'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Server Conflict Alert Banner (Fallback) */}
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
              <div style={{ fontWeight: 700 }}>Scheduling Conflict:</div>
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
            placeholder="+1 (555) 019-2831"
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
          placeholder="johndoe@example.com"
          icon={Mail}
          error={errors.patientEmail}
        />

        {/* Doctor Selector */}
        <div style={{ marginTop: '0.25rem' }}>
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
                marginTop: '-0.25rem',
                marginBottom: '1rem',
                padding: '0.625rem 0.875rem',
                background: isDoctorAvailableOnDay ? '#f0fdf4' : '#fff1f2',
                border: `1px solid ${isDoctorAvailableOnDay ? '#bbf7d0' : '#fecdd3'}`,
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: isDoctorAvailableOnDay ? '#166534' : '#9f1239',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={15} />
                <span>
                  <strong>{selectedDoctor.name}</strong> • Works:{' '}
                  {selectedDoctor.availabilityDays?.join(', ')} ({selectedDoctor.availableHoursStart} - {selectedDoctor.availableHoursEnd})
                </span>
              </div>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: isDoctorAvailableOnDay ? '#dcfce7' : '#ffe4e6',
                }}
              >
                {isDoctorAvailableOnDay ? `Open on ${selectedWeekday}` : `Closed on ${selectedWeekday}`}
              </span>
            </div>
          )}
        </div>

        {/* Date & Duration Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
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
            {/* Warning if selected date is on a non-working day */}
            {!isDoctorAvailableOnDay && selectedDoctor && (
              <div
                style={{
                  marginTop: '-0.5rem',
                  marginBottom: '0.75rem',
                  fontSize: '0.775rem',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <XCircle size={14} />
                <span>
                  Dr. {selectedDoctor.name} is not available on {selectedWeekday}s. Please choose one of:{' '}
                  <strong>{selectedDoctor.availabilityDays?.join(', ')}</strong>
                </span>
              </div>
            )}
          </div>

          <Select
            label="Visit Duration"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
            options={durationOptions}
          />
        </div>

        {/* Dynamic Time Slot Picker with Booked Conflict Exclusion */}
        <div style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <label
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <Clock size={15} color="#0284c7" />
              Available Time Slots ({formData.durationMinutes}m)
            </label>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {loadingBookings ? (
                <span>Checking live schedule...</span>
              ) : (
                <span>
                  <strong style={{ color: '#059669' }}>{availableSlotsCount} Available</strong>
                  {bookedSlotsCount > 0 && (
                    <span style={{ color: '#94a3b8', marginLeft: '6px' }}>
                      • {bookedSlotsCount} Booked
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Time Slot Chips Grid */}
          {!isDoctorAvailableOnDay ? (
            <div
              style={{
                padding: '1.25rem',
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.85rem',
              }}
            >
              No slots available because the doctor is off on {selectedWeekday}s. Please choose an active working day above.
            </div>
          ) : generatedSlots.length === 0 ? (
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b',
                fontSize: '0.825rem',
                textAlign: 'center',
              }}
            >
              No available hours found for this doctor.
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                  gap: '0.5rem',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  padding: '4px',
                }}
              >
                {generatedSlots.map((slot) => {
                  const isSelected = formData.appointmentTime === slot.time && !slot.isBooked;

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={slot.isBooked}
                      onClick={() => handleSelectSlot(slot)}
                      title={slot.isBooked ? `Already booked by ${slot.bookedBy || 'another patient'}` : `Select ${slot.time}`}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '6px',
                        fontSize: '0.825rem',
                        fontWeight: isSelected ? 700 : 500,
                        border: isSelected
                          ? '2px solid #0284c7'
                          : slot.isBooked
                          ? '1px solid #e2e8f0'
                          : '1px solid #cbd5e1',
                        background: isSelected
                          ? '#e0f2fe'
                          : slot.isBooked
                          ? '#f1f5f9'
                          : '#ffffff',
                        color: isSelected
                          ? '#0369a1'
                          : slot.isBooked
                          ? '#94a3b8'
                          : '#1e293b',
                        cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        transition: 'all 0.15s ease',
                        position: 'relative',
                      }}
                    >
                      <span>{slot.time}</span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: slot.isBooked ? '#94a3b8' : isSelected ? '#0284c7' : '#059669',
                          textDecoration: slot.isBooked ? 'line-through' : 'none',
                        }}
                      >
                        {slot.isBooked ? 'Booked' : isSelected ? 'Selected' : 'Open'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {errors.appointmentTime && (
                <div style={{ color: '#dc2626', fontSize: '0.775rem', marginTop: '4px' }}>
                  {errors.appointmentTime}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Treatment Reason Dropdown with Custom "Other" Option */}
        <div style={{ marginTop: '0.5rem' }}>
          <Select
            label="Reason / Treatment Procedure"
            name="reasonSelect"
            value={formData.reasonSelect}
            onChange={handleChange}
            required
            options={PREDEFINED_REASONS.map((r) => ({ value: r, label: r }))}
            error={errors.reasonSelect}
          />

          {/* Dynamic Custom Reason Input */}
          {formData.reasonSelect === 'Other (Custom Reason)' && (
            <div style={{ marginTop: '-0.25rem', marginBottom: '1rem' }}>
              <Input
                label="Specify Custom Treatment / Reason"
                name="customReason"
                value={formData.customReason}
                onChange={handleChange}
                placeholder="e.g. Tooth sensitivity examination, dental mouthguard fitting..."
                required
                error={errors.customReason}
              />
            </div>
          )}
        </div>

        {/* Status (if editing) */}
        {isEdit && (
          <div style={{ marginTop: '0.5rem' }}>
            <Select
              label="Appointment Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
          </div>
        )}

        {/* Clinical Notes */}
        <div style={{ marginTop: '0.5rem' }}>
          <Textarea
            label="Clinical Notes / Pre-visit Instructions (Optional)"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Special patient requests, dental anxiety alerts, or medical notes..."
            rows={2}
          />
        </div>
      </form>
    </Modal>
  );
};
