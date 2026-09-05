import React from 'react';
import {
  Phone,
  Mail,
  Clock,
  Calendar,
  Star,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';

export const DoctorCard = ({
  doctor,
  onEdit,
  onDelete,
  onViewDetails,
  onToggleStatus,
}) => {
  const getInitials = (name) => {
    if (!name) return 'DR';
    return name
      .replace(/Dr\.\s*/i, '')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const shortDays = (days = []) => {
    const map = {
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
      Sunday: 'Sun',
    };
    return days.map((d) => map[d] || d);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        opacity: doctor.isActive ? 1 : 0.8,
        borderTop: doctor.isActive ? '3px solid #0ea5e9' : '3px solid #cbd5e1',
      }}
    >
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Doctor Header & Avatar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#0369a1',
              flexShrink: 0,
              border: '2px solid #ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            {doctor.avatarUrl ? (
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              getInitials(doctor.name)
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={doctor.name}
              >
                {doctor.name}
              </h3>
              <Badge
                variant={doctor.isActive ? 'active' : 'inactive'}
                showDot
              >
                {doctor.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0ea5e9', marginTop: '2px' }}>
              {doctor.specialization}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.775rem', color: '#f59e0b', fontWeight: 600 }}>
                <Star size={13} fill="#f59e0b" />
                <span>{doctor.rating ? doctor.rating.toFixed(1) : '4.9'}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>•</span>
              <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
                {doctor.experienceYears} {doctor.experienceYears === 1 ? 'yr' : 'yrs'} exp
              </span>
            </div>
          </div>
        </div>

        {/* Room / Location */}
        {doctor.roomNumber && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
            <MapPin size={14} style={{ color: '#0ea5e9' }} />
            <span>{doctor.roomNumber}</span>
          </div>
        )}

        {/* Working Hours & Available Days */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: '8px',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            border: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569' }}>
            <Clock size={14} style={{ color: '#0ea5e9' }} />
            <span>
              {doctor.availableHoursStart || '09:00'} - {doctor.availableHoursEnd || '17:00'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
            <Calendar size={13} style={{ color: '#94a3b8', marginRight: '2px' }} />
            {shortDays(doctor.availabilityDays).map((day) => (
              <span
                key={day}
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                }}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8rem', color: '#64748b' }}>
          <a
            href={`tel:${doctor.phone}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}
            className="hover:text-primary"
          >
            <Phone size={13} style={{ color: '#0ea5e9' }} />
            <span>{doctor.phone}</span>
          </a>
          <a
            href={`mailto:${doctor.email}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}
            className="hover:text-primary"
          >
            <Mail size={13} style={{ color: '#0ea5e9' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doctor.email}
            </span>
          </a>
        </div>
      </div>

      {/* Card Actions */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid #f1f5f9',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={() => onViewDetails(doctor)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          <Eye size={15} />
          <span>View Profile</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => onEdit(doctor)}
            className="btn-icon"
            title="Edit Doctor"
            aria-label={`Edit ${doctor.name}`}
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(doctor)}
            className="btn-icon"
            style={{ color: '#ef4444' }}
            title="Delete Doctor"
            aria-label={`Delete ${doctor.name}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
