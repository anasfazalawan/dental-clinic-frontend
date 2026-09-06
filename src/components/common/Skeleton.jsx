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
      className={`skeleton ${className}`}
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
          50% { opacity: 0.35; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export const DoctorCardSkeleton = () => (
  <div
    style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Skeleton width="56px" height="56px" borderRadius="12px" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <Skeleton width="65%" height="18px" />
        <Skeleton width="45%" height="14px" />
        <Skeleton width="30%" height="12px" />
      </div>
    </div>
    <Skeleton width="100%" height="48px" borderRadius="8px" />
    <Skeleton width="80%" height="14px" />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
      <Skeleton width="90px" height="28px" borderRadius="6px" />
      <Skeleton width="60px" height="28px" borderRadius="6px" />
    </div>
  </div>
);

export const DoctorCardGridSkeleton = ({ count = 6 }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.25rem',
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <DoctorCardSkeleton key={`doc-skel-${i}`} />
    ))}
  </div>
);

export const TableRowSkeleton = ({ columns = 6 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} style={{ padding: '1rem 1.25rem' }}>
        <Skeleton width={`${65 + ((i * 17) % 30)}%`} height="16px" />
      </td>
    ))}
  </tr>
);

export const TableSkeleton = ({ rows = 5, columns = 6, headers = [] }) => (
  <div className="table-container">
    <table className="custom-table">
      {headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={`row-skel-${i}`} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);
