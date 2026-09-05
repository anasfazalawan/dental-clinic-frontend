import React from 'react';
import clsx from 'clsx';

export const StatCard = ({
  label,
  value,
  icon: Icon,
  variant = 'primary', // emerald, amber, teal, purple, primary
  meta,
  loading = false,
}) => {
  return (
    <div className={clsx('stat-card', variant)}>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{loading ? '—' : value}</span>
        {meta && <span className="stat-meta">{meta}</span>}
      </div>
      {Icon && (
        <div className="stat-icon">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};
