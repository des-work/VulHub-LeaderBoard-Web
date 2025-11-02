'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#0a0a0a',
      color: '#00ff00',
      fontFamily: 'monospace'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        padding: '40px',
        border: '2px solid #00ff00',
        borderRadius: '8px'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</h1>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
          Something went wrong!
        </h2>
        <p style={{ marginBottom: '20px', color: '#00cc00' }}>
          {error.message || 'An unexpected error occurred'}
        </p>
        {error.digest && (
          <p style={{ fontSize: '12px', marginBottom: '20px', opacity: 0.7 }}>
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#00ff00',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

