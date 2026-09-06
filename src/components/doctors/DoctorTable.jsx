import React, { memo } from 'react';
import { Edit2, Trash2, Eye, Star } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';

export const DoctorTable = memo(({
  doctors,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Specialization</th>
            <th>Availability</th>
            <th>Working Hours</th>
            <th>Contact</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>
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
                    {doctor.avatarUrl ? (
                      <img
                        src={doctor.avatarUrl}
                        alt={doctor.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      doctor.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      {doctor.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={11} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                      <span>{doctor.rating?.toFixed(1) || '4.9'}</span>
                      {doctor.roomNumber && (
                        <>
                          <span>•</span>
                          <span>{doctor.roomNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span style={{ fontWeight: 500, color: '#0284c7' }}>
                  {doctor.specialization}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', maxWidth: '180px' }}>
                  {doctor.availabilityDays?.slice(0, 3).map((d) => (
                    <span
                      key={d}
                      style={{
                        fontSize: '0.7rem',
                        padding: '1px 5px',
                        background: '#f1f5f9',
                        borderRadius: '3px',
                        color: '#475569',
                      }}
                    >
                      {d.substring(0, 3)}
                    </span>
                  ))}
                  {(doctor.availabilityDays?.length || 0) > 3 && (
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      +{doctor.availabilityDays.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                  {doctor.availableHoursStart || '09:00'} - {doctor.availableHoursEnd || '17:00'}
                </span>
              </td>
              <td>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <div>{doctor.phone}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{doctor.email}</div>
                </div>
              </td>
              <td>
                <Badge variant={doctor.isActive ? 'active' : 'inactive'} showDot>
                  {doctor.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                  <button
                    type="button"
                    onClick={() => onViewDetails(doctor)}
                    className="btn-icon"
                    title="View Details"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(doctor)}
                    className="btn-icon"
                    title="Edit Doctor"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(doctor)}
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    title="Delete Doctor"
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

DoctorTable.displayName = 'DoctorTable';
