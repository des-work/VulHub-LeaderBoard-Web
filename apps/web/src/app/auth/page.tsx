'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/context';
import { TEST_ACCOUNTS } from '../../lib/auth/testCredentials';

export default function AuthPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const hasRedirected = React.useRef(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated - use useEffect to watch auth state
  useEffect(() => {
    if (isAuthenticated && !isLoading && !hasRedirected.current) {
      hasRedirected.current = true;
      
      // Use setTimeout to allow other effects to settle
      const timeoutId = setTimeout(() => {
        // Use window.location to ensure we stay on the same port and avoid routing issues
        window.location.href = '/';
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#0f0',
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '32px',
        border: '2px solid #0f0',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 255, 0, 0.05)'
      }}>
        <h1 style={{
          fontSize: '32px',
          marginBottom: '8px',
          textAlign: 'center',
          textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
        }}>
          VulHub Leaderboard
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#888',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Master cybersecurity through competition
        </p>

        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid #f00',
            color: '#f00',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#111',
                border: '1px solid #0f0',
                color: '#0f0',
                fontFamily: 'monospace',
                fontSize: '14px',
                borderRadius: '4px',
                boxSizing: 'border-box',
                opacity: isSubmitting ? 0.5 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'text'
              }}
              placeholder="your@email.com"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#111',
                border: '1px solid #0f0',
                color: '#0f0',
                fontFamily: 'monospace',
                fontSize: '14px',
                borderRadius: '4px',
                boxSizing: 'border-box',
                opacity: isSubmitting ? 0.5 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'text'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isSubmitting ? '#555' : '#0f0',
              color: '#000',
              border: 'none',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
              transition: 'all 0.3s'
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Test Credentials Helper */}
        {process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: 'rgba(0, 255, 0, 0.05)',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            borderRadius: '4px'
          }}>
            <h3 style={{
              fontSize: '12px',
              marginBottom: '12px',
              color: '#0f0',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              🔑 Test Accounts (Dev Mode)
            </h3>
            <div style={{ fontSize: '11px', color: '#888', lineHeight: '1.6' }}>
              {TEST_ACCOUNTS.map((account, idx) => (
                <div 
                  key={idx}
                  style={{
                    marginBottom: '8px',
                    padding: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                    e.currentTarget.style.borderLeft = '3px solid #0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderLeft = 'none';
                  }}
                >
                  <div style={{ color: '#0f0', marginBottom: '2px' }}>
                    <strong>{account.role.toUpperCase()}</strong>: {account.name}
                  </div>
                  <div style={{ color: '#666', fontSize: '10px' }}>
                    {account.email} / {account.password}
                  </div>
                </div>
              ))}
              <div style={{ 
                marginTop: '12px', 
                fontSize: '10px', 
                color: '#666',
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                💡 Click any account to auto-fill the form
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}