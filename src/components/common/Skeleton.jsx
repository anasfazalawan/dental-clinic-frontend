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

export const StatCardSkeleton = () => (
  <div
    style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '1.25rem',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Skeleton width="45%" height="16px" />
      <Skeleton width="36px" height="36px" borderRadius="10px" />
    </div>
    <Skeleton width="35%" height="32px" borderRadius="6px" />
    <Skeleton width="60%" height="14px" />
  </div>
);

export const QuickActionsSkeleton = () => (
  <div
    style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      border: '1px solid #e2e8f0',
      marginBottom: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <Skeleton width="180px" height="20px" />
      <Skeleton width="260px" height="14px" />
    </div>
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <Skeleton width="150px" height="38px" borderRadius="8px" />
      <Skeleton width="130px" height="38px" borderRadius="8px" />
      <Skeleton width="100px" height="38px" borderRadius="8px" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div>
    <QuickActionsSkeleton />

    {/* 4 Stat Cards */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem',
      }}
    >
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Middle Section */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.75rem',
      }}
    >
      {/* Today Schedule Card Skeleton */}
      <div className="card">
        <div className="card-header">
          <Skeleton width="160px" height="20px" />
          <Skeleton width="70px" height="24px" borderRadius="4px" />
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <Skeleton width="50px" height="24px" borderRadius="4px" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <Skeleton width="55%" height="16px" />
                  <Skeleton width="40%" height="12px" />
                </div>
              </div>
              <Skeleton width="75px" height="24px" borderRadius="4px" />
            </div>
          ))}
        </div>
      </div>

      {/* Attending Specialists Card Skeleton */}
      <div className="card">
        <div className="card-header">
          <Skeleton width="180px" height="20px" />
          <Skeleton width="60px" height="28px" borderRadius="6px" />
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Skeleton width="38px" height="38px" borderRadius="8px" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <Skeleton width="120px" height="16px" />
                  <Skeleton width="90px" height="12px" />
                </div>
              </div>
              <Skeleton width="75px" height="24px" borderRadius="4px" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Appointments Card Skeleton */}
    <div className="card">
      <div className="card-header">
        <div>
          <Skeleton width="180px" height="20px" />
          <div style={{ marginTop: '4px' }}>
            <Skeleton width="260px" height="14px" />
          </div>
        </div>
        <Skeleton width="140px" height="32px" borderRadius="6px" />
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <TableSkeleton rows={4} columns={6} headers={['PATIENT', 'SPECIALIST', 'DATE & TIME', 'PROCEDURE', 'STATUS', 'ACTIONS']} />
      </div>
    </div>
  </div>
);
