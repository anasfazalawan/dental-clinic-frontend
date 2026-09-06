import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Award, Clock, MapPin, Image, FileText } from 'lucide-react';
import { Modal } from '../common/Modal.jsx';
import { Input, Textarea } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';

const allDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const defaultSpecializations = [
  'General Dentistry',
  'Orthodontics',
  'Periodontics',
  'Endodontics',
  'Pediatric Dentistry',
  'Oral & Maxillofacial Surgery',
  'Prosthodontics',
  'Cosmetic Dentistry',
];

export const DoctorFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
  serverError = null,
}) => {
  const isEdit = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'General Dentistry',
    customSpecialization: '',
    experienceYears: 5,
    availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableHoursStart: '09:00',
    availableHoursEnd: '17:00',
    isActive: true,
    rating: 4.9,
    roomNumber: '',
    avatarUrl: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (initialData) {
      const isCustomSpec = !defaultSpecializations.includes(initialData.specialization);
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        specialization: isCustomSpec ? 'Other' : (initialData.specialization || 'General Dentistry'),
        customSpecialization: isCustomSpec ? initialData.specialization : '',
        experienceYears: initialData.experienceYears ?? 5,
        availabilityDays: initialData.availabilityDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableHoursStart: initialData.availableHoursStart || '09:00',
        availableHoursEnd: initialData.availableHoursEnd || '17:00',
        isActive: initialData.isActive ?? true,
        rating: initialData.rating ?? 4.9,
        roomNumber: initialData.roomNumber || '',
        avatarUrl: initialData.avatarUrl || '',
        bio: initialData.bio || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: 'General Dentistry',
        customSpecialization: '',
        experienceYears: 5,
        availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableHoursStart: '09:00',
        availableHoursEnd: '17:00',
        isActive: true,
        rating: 4.9,
        roomNumber: '',
        avatarUrl: '',
        bio: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.availabilityDays.includes(day);
      const updated = exists
        ? prev.availabilityDays.filter((d) => d !== day)
        : [...prev.availabilityDays, day];
      return { ...prev, availabilityDays: updated };
    });
    if (errors.availabilityDays) {
      setErrors((prev) => ({ ...prev, availabilityDays: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Doctor name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (formData.specialization === 'Other' && !formData.customSpecialization.trim()) {
      errs.customSpecialization = 'Specify specialization';
    }
    if (formData.availabilityDays.length === 0) {
      errs.availabilityDays = 'Select at least one available working day';
    }
    if (formData.availableHoursStart >= formData.availableHoursEnd) {
      errs.availableHoursEnd = 'End time must be later than start time';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalSpecialization =
      formData.specialization === 'Other'
        ? formData.customSpecialization.trim()
        : formData.specialization;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      specialization: finalSpecialization,
      experienceYears: Number(formData.experienceYears) || 0,
      availabilityDays: formData.availabilityDays,
      availableHoursStart: formData.availableHoursStart,
      availableHoursEnd: formData.availableHoursEnd,
      isActive: Boolean(formData.isActive),
      rating: Number(formData.rating) || 4.9,
      roomNumber: formData.roomNumber.trim() || null,
      avatarUrl: formData.avatarUrl.trim() || null,
      bio: formData.bio.trim() || null,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Doctor Profile' : 'Add New Doctor'}
      subtitle={isEdit ? `Updating information for ${initialData?.name}` : 'Enter physician details and weekly schedule'}
      maxWidth="680px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Doctor'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Server Validation / Error Alert Banner */}
        {serverError && (
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
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontWeight: 700, flexShrink: 0 }}>Notice:</div>
            <div style={{ flex: 1 }}>{serverError}</div>
          </div>
        )}

        {/* Basic Info */}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <Input
            label="Full Name & Title"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Dr. Sarah Jenkins, DDS"
            required
            icon={User}
            error={errors.name}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="doctor@dentpulse.com"
            required
            icon={Mail}
            error={errors.email}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 234-5678"
            required
            icon={Phone}
            error={errors.phone}
          />
          <Select
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            options={[
              ...defaultSpecializations.map((s) => ({ label: s, value: s })),
              { label: 'Other Specialization...', value: 'Other' },
            ]}
          />
        </div>

        {formData.specialization === 'Other' && (
          <Input
            label="Specify Specialization"
            name="customSpecialization"
            value={formData.customSpecialization}
            onChange={handleChange}
            placeholder="e.g. Maxillofacial Radiology"
            required
            error={errors.customSpecialization}
          />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <Input
            label="Experience (Years)"
            name="experienceYears"
            type="number"
            min="0"
            max="60"
            value={formData.experienceYears}
            onChange={handleChange}
            icon={Award}
          />
          <Input
            label="Room / Suite"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            placeholder="e.g. Suite 102"
            icon={MapPin}
          />
          <Input
            label="Rating (1.0 - 5.0)"
            name="rating"
            type="number"
            step="0.1"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
          />
        </div>

        {/* Schedule & Working Days */}
        <div style={{ margin: '1rem 0 0.5rem' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Available Working Days <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {allDays.map((day) => {
              const selected = formData.availabilityDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: selected ? '1px solid #0ea5e9' : '1px solid #cbd5e1',
                    background: selected ? '#e0f2fe' : '#ffffff',
                    color: selected ? '#0284c7' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {errors.availabilityDays && (
            <div className="form-error">{errors.availabilityDays}</div>
          )}
        </div>

        {/* Working Hours */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <Input
            label="Shift Start Time"
            name="availableHoursStart"
            type="time"
            value={formData.availableHoursStart}
            onChange={handleChange}
            icon={Clock}
            required
          />
          <Input
            label="Shift End Time"
            name="availableHoursEnd"
            type="time"
            value={formData.availableHoursEnd}
            onChange={handleChange}
            icon={Clock}
            required
            error={errors.availableHoursEnd}
          />
        </div>

        {/* Avatar URL & Bio */}
        <Input
          label="Profile Photo / Avatar URL"
          name="avatarUrl"
          value={formData.avatarUrl}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/..."
          icon={Image}
          helperText="Leave blank for automatic initials avatar"
        />

        <Textarea
          label="Biography & Clinical Notes"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Summary of doctor's clinical background and dental expertise..."
          rows={2}
        />

        {/* Active Status Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', padding: '0.5rem 0' }}>
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
            style={{ width: '18px', height: '18px', accentColor: '#0ea5e9', cursor: 'pointer' }}
          />
          <label htmlFor="isActive" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            Doctor is Active and Available for Patient Bookings
          </label>
        </div>
      </form>
    </Modal>
  );
};
