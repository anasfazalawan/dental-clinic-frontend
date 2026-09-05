import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = '6px',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#e2e8f0',
        animation: 'skeletonPulse 1.5s ease-in-out infinite',
        ...style,
      }}
    >
      <style>{`
        @keyframes skeletonPulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export const CardSkeleton = () => (
  <div
    style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '14px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Skeleton width="52px" height="52px" borderRadius="10px" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Skeleton width="60%" height="18px" />
        <Skeleton width="40%" height="14px" />
      </div>
    </div>
    <Skeleton width="100%" height="36px" />
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Skeleton width="30%" height="24px" borderRadius="12px" />
      <Skeleton width="30%" height="24px" borderRadius="12px" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} style={{ padding: '1rem 1.25rem' }}>
        <Skeleton width={`${70 + (i % 3) * 10}%`} height="16px" />
      </td>
    ))}
  </tr>
);
