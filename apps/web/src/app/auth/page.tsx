'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/context';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();
  const hasRedirected = React.useRef(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated - use useEffect to watch auth state
  useEffect(() => {
    if (isAuthenticated && !isLoading && !hasRedirected.current) {
      hasRedirected.current = true;
      console.log('[AuthPage] Authenticated, scheduling redirect to home');
      
      // Use setTimeout to allow other effects to settle
      const timeoutId = setTimeout(() => {
        console.log('[AuthPage] Executing redirect to home');
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
    console.log('[AuthPage] handleSubmit called with:', { email });

    try {
      console.log('[AuthPage] Calling login...');
      await login({ email, password });
      console.log('[AuthPage] Login successful, isAuthenticated should be true now');
    } catch (err: any) {
      console.log('[AuthPage] Login failed:', err);
      setError(err.message || 'Login failed');
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
      </div>
    </div>
  );
}