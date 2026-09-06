import React, { memo } from 'react';
import { Clock, CalendarDays, CheckCircle2, ArrowRight } from 'lucide-react';
import { QuickStatusSelect } from '../appointments/QuickStatusSelect.jsx';
import { Button } from '../common/Button.jsx';
import { formatTime } from '../../utils/formatters.js';

export const TodaySchedule = memo(({
  schedule = [],
  onStatusChange,
  onViewAll,
}) => {
  const displaySchedule = schedule.slice(0, 3);
  const remainingCount = Math.max(0, schedule.length - 3);

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">
          <CalendarDays size={18} style={{ color: '#0ea5e9' }} />
          <span>Today's Clinic Schedule</span>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
            {schedule.length} {schedule.length === 1 ? 'Patient' : 'Patients'}
          </span>
          {schedule.length > 0 && onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
      </div>

      <div className="card-body" style={{ flex: 1, padding: schedule.length === 0 ? '2rem 1.5rem' : '1rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {schedule.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
              }}
            >
              <CheckCircle2 size={24} />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              No Appointments Remaining Today
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
              All visits for today are complete or none are booked yet.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {displaySchedule.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Time badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      background: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#0284c7',
                    }}
                  >
                    <Clock size={13} />
                    <span>{formatTime(apt.appointmentTime)}</span>
                  </div>

                  {/* Patient & Doctor */}
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      {apt.patientName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {apt.reason} • <strong style={{ color: '#0284c7' }}>{apt.doctor?.name}</strong>
                    </div>
                  </div>

                  {/* Status Switcher */}
                  <QuickStatusSelect
                    currentStatus={apt.status}
                    onStatusChange={(newStatus) => onStatusChange(apt.id, newStatus)}
                  />
                </div>
              ))}
            </div>

            {remainingCount > 0 && onViewAll && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewAll}
                icon={ArrowRight}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  justifyContent: 'center',
                  fontSize: '0.825rem',
                }}
              >
                View all {schedule.length} today's appointments (+{remainingCount} more)
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

TodaySchedule.displayName = 'TodaySchedule';
