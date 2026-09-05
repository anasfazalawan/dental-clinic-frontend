import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartCrack, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: '#fef2f2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <HeartCrack size={36} />
      </div>

      <h1
        style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          color: '#0f172a',
          letterSpacing: '-0.03em',
          lineHeight: '1',
          marginBottom: '0.5rem',
        }}
      >
        404
      </h1>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
        Page Not Found
      </h2>

      <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '420px', marginBottom: '1.75rem' }}>
        The clinical page or record you are searching for does not exist or has been moved.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Button variant="outline" onClick={() => navigate(-1)} icon={ArrowLeft}>
          Go Back
        </Button>
        <Button onClick={() => navigate('/')} icon={Home}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
