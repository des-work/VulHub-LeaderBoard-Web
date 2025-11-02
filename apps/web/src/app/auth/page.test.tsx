'use client';

/**
 * MINIMAL TEST VERSION - Auth Page
 * This version removes all complex dependencies to test basic rendering
 */

import React from 'react';

export default function AuthPageTest() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        ✓ AUTH PAGE RENDERING TEST
      </h1>
      <p style={{ fontSize: '16px', color: '#888' }}>
        If you see this, the page component is working.
      </p>
      <div style={{ marginTop: '40px', padding: '20px', border: '2px solid #0f0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Simple Login Form</h2>
        <form onSubmit={(e) => { e.preventDefault(); alert('Form works!'); }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email:</label>
            <input 
              type="email" 
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#111',
                border: '1px solid #0f0',
                color: '#0f0',
                fontFamily: 'monospace'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password:</label>
            <input 
              type="password" 
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#111',
                border: '1px solid #0f0',
                color: '#0f0',
                fontFamily: 'monospace'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0f0',
              color: '#000',
              border: 'none',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Sign In (Test)
          </button>
        </form>
      </div>
    </div>
  );
}
