'use client';

import React from 'react';
import { useCSS } from '../../components/CSSProvider';

export default function CSSTestPage() {
  const { isHealthy, isFallbackActive, debugInfo, retryCSS, status } = useCSS();

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">CSS System Test Page</h1>
        
        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-green-500">
            <h2 className="text-xl font-bold mb-4">CSS Status</h2>
            <div className="space-y-2">
              <div className={`px-3 py-2 rounded ${isHealthy ? 'bg-green-600' : 'bg-red-600'}`}>
                Health: {isHealthy ? 'Healthy' : 'Unhealthy'}
              </div>
              <div className={`px-3 py-2 rounded ${isFallbackActive ? 'bg-yellow-600' : 'bg-blue-600'}`}>
                Fallback: {isFallbackActive ? 'Active' : 'Inactive'}
              </div>
              <div className="px-3 py-2 rounded bg-gray-600">
                Retry Count: {status.retryCount}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-green-500">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={retryCSS}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
              >
                Retry CSS Loading
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="bg-gray-900 p-6 rounded-lg border border-green-500 mb-8">
            <h2 className="text-xl font-bold mb-4">Debug Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-green-300 mb-2">Loaded Stylesheets ({debugInfo.loadedStylesheets.length}):</h3>
                <div className="space-y-1">
                  {debugInfo.loadedStylesheets.map((href, index) => (
                    <div key={index} className="text-sm text-gray-300 break-all">
                      {href}
                    </div>
                  ))}
                </div>
              </div>

              {debugInfo.errors.length > 0 && (
                <div>
                  <h3 className="font-bold text-red-300 mb-2">Errors ({debugInfo.errors.length}):</h3>
                  <div className="space-y-1">
                    {debugInfo.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-300 break-all">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {debugInfo.warnings.length > 0 && (
                <div>
                  <h3 className="font-bold text-yellow-300 mb-2">Warnings ({debugInfo.warnings.length}):</h3>
                  <div className="space-y-1">
                    {debugInfo.warnings.map((warning, index) => (
                      <div key={index} className="text-sm text-yellow-300 break-all">
                        {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {debugInfo.missingClasses.length > 0 && (
                <div>
                  <h3 className="font-bold text-orange-300 mb-2">Missing Classes ({debugInfo.missingClasses.length}):</h3>
                  <div className="text-sm text-orange-300 break-all">
                    {debugInfo.missingClasses.join(', ')}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-bold text-green-300 mb-2">Performance:</h3>
                <div className="text-sm text-gray-300">
                  Load Time: {debugInfo.performance.loadTime.toFixed(2)}ms
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSS Test Elements */}
        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">
          <h2 className="text-xl font-bold mb-4">CSS Test Elements</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/20 p-4 rounded border border-green-500">
                <h3 className="font-bold text-green-400">Tailwind Test</h3>
                <p className="text-sm text-gray-300">This should have green background and border</p>
              </div>
              <div className="bg-blue-500/20 p-4 rounded border border-blue-500">
                <h3 className="font-bold text-blue-400">Color Test</h3>
                <p className="text-sm text-gray-300">This should have blue background and border</p>
              </div>
              <div className="bg-yellow-500/20 p-4 rounded border border-yellow-500">
                <h3 className="font-bold text-yellow-400">Layout Test</h3>
                <p className="text-sm text-gray-300">This should be in a grid layout</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors">
                Hover Test
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors">
                Button Test
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                Color Test
              </button>
            </div>

            <div className="text-center">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <span className="text-white font-bold">Gradient Test</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
