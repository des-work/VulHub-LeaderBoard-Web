'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth/context';
import { Button } from '../../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { User, Lock, School, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    schoolId: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card variant="matrix" className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <School className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <CardTitle className="text-2xl font-mono text-green-400">
          Student Login
        </CardTitle>
        <p className="text-gray-400 font-mono text-sm">
          Enter your school credentials to access the platform
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-green-300 mb-2">
                School ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleChange}
                  placeholder="Enter your school ID"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-green-400 font-mono focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-green-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-green-400 font-mono focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="matrix"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-center">
            <p className="text-gray-400 font-mono text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-green-400 hover:text-green-300 underline"
              >
                Register here
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
