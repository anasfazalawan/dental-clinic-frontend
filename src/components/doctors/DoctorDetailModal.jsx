import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Star,
  Award,
  CalendarDays,
  User,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../common/Modal.jsx';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';
import { LoadingSpinner } from '../common/LoadingSpinner.jsx';
import { doctorService } from '../../services/doctorService.js';
import { formatDate, formatTime } from '../../utils/formatters.js';

export const DoctorDetailModal = ({ isOpen, onClose, doctorId, onBookWithDoctor }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !doctorId) return;

    const fetchDoctor = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await doctorService.getDoctorById(doctorId);
        setDoctor(data);
      } catch (err) {
        setError(err.message || 'Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [isOpen, doctorId]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Doctor Profile & Schedule"
      subtitle="Detailed specialist record, credentials, and booked treatments"
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {doctor && (
            <Button
              onClick={() => {
                onClose();
                if (onBookWithDoctor) onBookWithDoctor(doctor);
              }}
              icon={CalendarDays}
            >
              Book with {doctor.name.split(',')[0]}
            </Button>
          )}
        </div>
      }
    >
      {loading ? (
        <LoadingSpinner text="Fetching physician details and schedule..." />
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
          <p>{error}</p>
        </div>
      ) : doctor ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Profile Section */}
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'center',
              padding: '1.25rem',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.4rem',
                color: '#0284c7',
                flexShrink: 0,
              }}
            >
              {doctor.avatarUrl ? (
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                doctor.name.substring(0, 2).toUpperCase()
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                  {doctor.name}
                </h3>
                <Badge variant={doctor.isActive ? 'active' : 'inactive'} showDot>
                  {doctor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0ea5e9', marginTop: '2px' }}>
                {doctor.specialization}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
                  <Star size={14} fill="#f59e0b" />
                  <span>{doctor.rating ? doctor.rating.toFixed(1) : '4.9'} / 5.0</span>
                </div>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                  <Award size={14} style={{ color: '#0ea5e9' }} />
                  <span>{doctor.experienceYears} Years Experience</span>
                </div>
                {doctor.roomNumber && (
                  <>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                      <MapPin size={14} style={{ color: '#0ea5e9' }} />
                      <span>{doctor.roomNumber}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Phone</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                <a href={`tel:${doctor.phone}`} style={{ color: 'inherit' }}>{doctor.phone}</a>
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Email</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                <a href={`mailto:${doctor.email}`} style={{ color: 'inherit' }}>{doctor.email}</a>
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Daily Shift</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                {doctor.availableHoursStart} - {doctor.availableHoursEnd}
              </div>
            </div>
          </div>

          {/* Working Days */}
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
              Scheduled Practice Days:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {doctor.availabilityDays?.map((d) => (
                <span
                  key={d}
                  style={{
                    padding: '0.35rem 0.75rem',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    color: '#15803d',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  ✓ {d}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          {doctor.bio && (
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                About Doctor:
              </div>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                {doctor.bio}
              </p>
            </div>
          )}

          {/* Assigned Appointments */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                Assigned Appointments ({doctor.appointments?.length || 0})
              </h4>
            </div>

            {doctor.appointments?.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                No active or past appointments recorded for this doctor.
              </p>
            ) : (
              <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date & Time</th>
                      <th>Treatment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctor.appointments?.map((apt) => (
                      <tr key={apt.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{apt.patientName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{apt.patientPhone}</div>
                        </td>
                        <td>
                          <div>{formatDate(apt.appointmentDate)}</div>
                          <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
                            {formatTime(apt.appointmentTime)} ({apt.durationMinutes}m)
                          </div>
                        </td>
                        <td>{apt.reason}</td>
                        <td>
                          <Badge status={apt.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
