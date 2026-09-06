import React, { memo } from 'react';
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Phone,
} from 'lucide-react';
import { QuickStatusSelect } from './QuickStatusSelect.jsx';
import { formatDate, formatTime } from '../../utils/formatters.js';

export const AppointmentTable = memo(({
  appointments,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getPatientInitials = (name) => {
    if (!name) return 'PT';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Patient Details</th>
            <th>Attending Doctor</th>
            <th>Date & Time</th>
            <th>Duration</th>
            <th>Treatment / Reason</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.id}>
              {/* Patient Column */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: '#f1f5f9',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      flexShrink: 0,
                    }}
                  >
                    {getPatientInitials(apt.patientName)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      {apt.patientName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={11} style={{ color: '#94a3b8' }} />
                      <span>{apt.patientPhone}</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Doctor Column */}
              <td>
                {apt.doctor ? (
                  <div>
                    <div style={{ fontWeight: 600, color: '#0284c7' }}>
                      {apt.doctor.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {apt.doctor.specialization}
                    </div>
                  </div>
                ) : (
                  <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Unassigned</span>
                )}
              </td>

              {/* Date & Time Column */}
              <td>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} style={{ color: '#0ea5e9' }} />
                    <span>{formatDate(apt.appointmentDate)}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Clock size={12} style={{ color: '#94a3b8' }} />
                    <span>{formatTime(apt.appointmentTime)}</span>
                  </div>
                </div>
              </td>

              {/* Duration */}
              <td>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                  }}
                >
                  {apt.durationMinutes || 30} mins
                </span>
              </td>

              {/* Reason / Notes */}
              <td>
                <div style={{ maxWidth: '220px' }}>
                  <div
                    style={{
                      fontWeight: 500,
                      color: '#334155',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={apt.reason}
                  >
                    {apt.reason}
                  </div>
                  {apt.notes && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={apt.notes}
                    >
                      {apt.notes}
                    </div>
                  )}
                </div>
              </td>

              {/* Status Selector */}
              <td>
                <QuickStatusSelect
                  currentStatus={apt.status}
                  onStatusChange={(newStatus) => onStatusChange(apt.id, newStatus)}
                />
              </td>

              {/* Actions */}
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                  <button
                    type="button"
                    onClick={() => onEdit(apt)}
                    className="btn-icon"
                    title="Edit Appointment"
                    aria-label={`Edit appointment for ${apt.patientName}`}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(apt)}
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    title="Cancel / Delete Appointment"
                    aria-label={`Delete appointment for ${apt.patientName}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

AppointmentTable.displayName = 'AppointmentTable';
