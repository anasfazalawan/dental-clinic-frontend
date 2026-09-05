import React from 'react';
import clsx from 'clsx';
import { formatStatus, getStatusBadgeClass } from '../../utils/formatters.js';

export const Badge = ({
  children,
  variant = 'default', // scheduled, confirmed, in-progress, completed, cancelled, no-show, active, inactive
  status,
  showDot = true,
  className = '',
}) => {
  const badgeClass = status ? getStatusBadgeClass(status) : `badge-${variant}`;
  const displayText = children || (status ? formatStatus(status) : '');

  return (
    <span className={clsx('badge', badgeClass, className)}>
      {showDot && <span className="badge-dot" />}
      <span>{displayText}</span>
    </span>
  );
};
