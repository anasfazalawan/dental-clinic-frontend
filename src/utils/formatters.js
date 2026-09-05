/**
 * Formatting utilities for dates, times, statuses, and badges.
 */

export const formatDate = (dateInput, options = {}) => {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(date);
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '—';
  if (timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }
  return timeStr;
};

export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  switch (status.toUpperCase()) {
    case 'SCHEDULED':
      return 'Scheduled';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    case 'NO_SHOW':
      return 'No Show';
    default:
      return status;
  }
};

export const getStatusBadgeClass = (status) => {
  if (!status) return 'badge-scheduled';
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
      return 'badge-confirmed';
    case 'IN_PROGRESS':
      return 'badge-in-progress';
    case 'COMPLETED':
      return 'badge-completed';
    case 'CANCELLED':
      return 'badge-cancelled';
    case 'NO_SHOW':
      return 'badge-no-show';
    case 'SCHEDULED':
    default:
      return 'badge-scheduled';
  }
};
