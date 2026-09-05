import React from 'react';
import { PlusCircle, UserPlus, RefreshCw, Database } from 'lucide-react';
import { Button } from '../common/Button.jsx';

export const QuickActions = ({
  onBookAppointment,
  onAddDoctor,
  onRefresh,
  onSeedData,
  refreshing = false,
  seeding = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
          Quick Actions:
        </span>
        <Button onClick={onBookAppointment} icon={PlusCircle} size="sm">
          Book Appointment
        </Button>
        <Button onClick={onAddDoctor} variant="outline" icon={UserPlus} size="sm">
          Add Doctor
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Button
          onClick={onRefresh}
          variant="secondary"
          icon={RefreshCw}
          size="sm"
          loading={refreshing}
          title="Refresh live dashboard metrics"
        >
          Refresh
        </Button>
        <Button
          onClick={onSeedData}
          variant="outline"
          icon={Database}
          size="sm"
          loading={seeding}
          title="Repopulate sample doctors and appointments"
        >
          Seed Demo Data
        </Button>
      </div>
    </div>
  );
};
