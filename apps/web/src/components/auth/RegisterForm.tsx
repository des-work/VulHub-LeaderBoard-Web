'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth/context';
import { Button } from '../../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { User, Lock, School, AlertCircle, CheckCircle } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    schoolId: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [validation, setValidation] = useState({
    passwordMatch: false,
    passwordLength: false,
    hasSchoolId: false,
    hasName: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update validation
    setValidation(prev => ({
      ...prev,
      passwordMatch: formData.password === value && name === 'confirmPassword',
      passwordLength: name === 'password' ? value.length >= 6 : prev.passwordLength,
      hasSchoolId: name === 'schoolId' ? value.length > 0 : prev.hasSchoolId,
      hasName: name === 'name' ? value.length > 0 : prev.hasName,
    }));
  };

  const isFormValid = validation.passwordMatch && validation.passwordLength && validation.hasSchoolId && validation.hasName;

  return (
    <Card variant="matrix" className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <School className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <CardTitle className="text-2xl font-mono text-green-400">
          Student Registration
        </CardTitle>
        <p className="text-gray-400 font-mono text-sm">
          Create your account to start your cybersecurity journey
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
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
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
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-green-400 font-mono focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-green-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-green-400 font-mono focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
                  required
                />
              </div>
            </div>
          </div>

          {/* Validation indicators */}
          <div className="space-y-2 text-sm">
            <div className={`flex items-center space-x-2 ${validation.passwordLength ? 'text-green-400' : 'text-gray-400'}`}>
              <CheckCircle className="h-4 w-4" />
              <span>Password must be at least 6 characters</span>
            </div>
            <div className={`flex items-center space-x-2 ${validation.passwordMatch ? 'text-green-400' : 'text-gray-400'}`}>
              <CheckCircle className="h-4 w-4" />
              <span>Passwords must match</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="matrix"
            size="lg"
            className="w-full"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <div className="text-center">
            <p className="text-gray-400 font-mono text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-green-400 hover:text-green-300 underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
