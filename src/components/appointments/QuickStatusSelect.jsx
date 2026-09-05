import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatStatus, getStatusBadgeClass } from '../../utils/formatters.js';

const statusOptions = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_SHOW', label: 'No Show' },
];

export const QuickStatusSelect = ({ currentStatus, onStatusChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (newStatus) => {
    setIsOpen(false);
    if (newStatus !== currentStatus) {
      onStatusChange(newStatus);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`badge ${getStatusBadgeClass(currentStatus)}`}
        style={{
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          padding: '4px 10px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span className="badge-dot" />
        <span>{formatStatus(currentStatus)}</span>
        {!disabled && <ChevronDown size={12} style={{ marginLeft: '2px' }} />}
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 30,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              zIndex: 40,
              minWidth: '130px',
              overflow: 'hidden',
            }}
          >
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  border: 'none',
                  background: opt.value === currentStatus ? '#f0f9ff' : 'transparent',
                  color: opt.value === currentStatus ? '#0284c7' : '#334155',
                  fontWeight: opt.value === currentStatus ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => (e.target.style.background = '#f8fafc')}
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    opt.value === currentStatus ? '#f0f9ff' : 'transparent')
                }
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background:
                      opt.value === 'CONFIRMED'
                        ? '#10b981'
                        : opt.value === 'IN_PROGRESS'
                        ? '#f59e0b'
                        : opt.value === 'COMPLETED'
                        ? '#0d9488'
                        : opt.value === 'CANCELLED'
                        ? '#ef4444'
                        : '#0ea5e9',
                  }}
                />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
