'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#0a0a0a',
        color: '#00ff00',
        fontFamily: 'monospace',
        margin: 0
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
            Critical Error
          </h2>
          <p style={{ marginBottom: '20px', color: '#00cc00' }}>
            {error.message || 'A critical error occurred'}
          </p>
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
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}

