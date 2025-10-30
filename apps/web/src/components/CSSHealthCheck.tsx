'use client';

import React, { useState, useEffect } from 'react';
import { cssDebugger, CSSDebugInfo } from '../lib/css/debugger';

interface CSSHealthCheckProps {
  showDebugPanel?: boolean;
  onStatusChange?: (isHealthy: boolean) => void;
}

export const CSSHealthCheck: React.FC<CSSHealthCheckProps> = ({
  showDebugPanel = false,
  onStatusChange,
}) => {
  const [debugInfo, setDebugInfo] = useState<CSSDebugInfo | null>(null);
  const [isHealthy, setIsHealthy] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const runDiagnosis = async () => {
      const info = await cssDebugger.diagnose();
      setDebugInfo(info);
      
      const healthy = info.hasTailwind && info.errors.length === 0;
      setIsHealthy(healthy);
      onStatusChange?.(healthy);
    };

    // Run initial diagnosis
    runDiagnosis();

    // Subscribe to updates
    const unsubscribe = cssDebugger.subscribe((info) => {
      setDebugInfo(info);
      const healthy = info.hasTailwind && info.errors.length === 0;
      setIsHealthy(healthy);
      onStatusChange?.(healthy);
    });

    // Re-run diagnosis periodically
    const interval = setInterval(runDiagnosis, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [onStatusChange]);

  if (!debugInfo) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-black px-3 py-2 rounded text-sm font-mono">
        CSS: Diagnosing...
      </div>
    );
  }

  const getStatusColor = () => {
    if (isHealthy) return 'bg-green-500';
    if (debugInfo.errors.length > 0) return 'bg-red-500';
    if (debugInfo.warnings.length > 0) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (isHealthy) return 'CSS: Healthy';
    if (debugInfo.errors.length > 0) return `CSS: ${debugInfo.errors.length} errors`;
    if (debugInfo.warnings.length > 0) return `CSS: ${debugInfo.warnings.length} warnings`;
    return 'CSS: Unknown';
  };

  return (
    <>
      {/* Status Indicator */}
      <div
        className={`fixed top-4 right-4 z-50 ${getStatusColor()} text-white px-3 py-2 rounded text-sm font-mono cursor-pointer hover:opacity-80`}
        onClick={() => setIsVisible(!isVisible)}
        title="Click to toggle debug panel"
      >
        {getStatusText()}
      </div>

      {/* Debug Panel */}
      {showDebugPanel && isVisible && (
        <div className="fixed top-16 right-4 z-50 bg-black border border-green-500 rounded-lg p-4 max-w-md max-h-96 overflow-y-auto font-mono text-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-green-400 font-bold">CSS Debug Panel</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Status */}
          <div className="mb-4">
            <div className="text-green-400 font-bold mb-2">Status:</div>
            <div className={`px-2 py-1 rounded text-xs ${getStatusColor()}`}>
              {isHealthy ? 'Healthy' : 'Issues Detected'}
            </div>
          </div>

          {/* Loaded Stylesheets */}
          <div className="mb-4">
            <div className="text-green-400 font-bold mb-2">Stylesheets ({debugInfo.loadedStylesheets.length}):</div>
            <div className="space-y-1">
              {debugInfo.loadedStylesheets.map((href, index) => (
                <div key={index} className="text-xs text-gray-300 break-all">
                  {href}
                </div>
              ))}
            </div>
          </div>

          {/* Errors */}
          {debugInfo.errors.length > 0 && (
            <div className="mb-4">
              <div className="text-red-400 font-bold mb-2">Errors ({debugInfo.errors.length}):</div>
              <div className="space-y-1">
                {debugInfo.errors.map((error, index) => (
                  <div key={index} className="text-xs text-red-300 break-all">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {debugInfo.warnings.length > 0 && (
            <div className="mb-4">
              <div className="text-yellow-400 font-bold mb-2">Warnings ({debugInfo.warnings.length}):</div>
              <div className="space-y-1">
                {debugInfo.warnings.map((warning, index) => (
                  <div key={index} className="text-xs text-yellow-300 break-all">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Classes */}
          {debugInfo.missingClasses.length > 0 && (
            <div className="mb-4">
              <div className="text-orange-400 font-bold mb-2">Missing Classes ({debugInfo.missingClasses.length}):</div>
              <div className="text-xs text-orange-300 break-all">
                {debugInfo.missingClasses.join(', ')}
              </div>
            </div>
          )}

          {/* Performance */}
          <div className="mb-4">
            <div className="text-green-400 font-bold mb-2">Performance:</div>
            <div className="text-xs text-gray-300">
              Load Time: {debugInfo.performance.loadTime.toFixed(2)}ms
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => cssDebugger.diagnose()}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
            >
              Re-diagnose
            </button>
            <button
              onClick={() => cssDebugger.reset()}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CSSHealthCheck;
