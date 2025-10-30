'use client';

/**
 * New Home Page
 * Clean, modular implementation using the new UI system
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../lib/ui/card';
import { useThemeValue } from '../lib/theme/context';
import { useAuth } from '../lib/auth/context';
import { Leaderboard } from '../components/leaderboard/Leaderboard';
import { SpectacularLeaderboard } from '../components/leaderboard/SpectacularLeaderboard';
import { SubmissionForm } from '../components/submissions/SubmissionForm';
import { Trophy, Users, Target, Award, Zap, Shield, Sword, Crown, Medal, Upload, LogOut, BookOpen } from 'lucide-react';
import RippleGridV2 from '../components/RippleGrid/RippleGridV2';
import { Activity } from '../lib/auth/types';

export default function HomePage() {
  const theme = useThemeValue();
  const { user, isAuthenticated, logout } = useAuth();
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [activities] = useState<Activity[]>([
    {
      id: 'vuln-001',
      name: 'SQL Injection Challenge',
      description: 'Find and exploit SQL injection vulnerabilities in a web application',
      points: 100,
      difficulty: 'beginner',
      category: 'Web Security',
      requirements: ['Basic SQL knowledge', 'Web browser'],
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 'vuln-002',
      name: 'Buffer Overflow Exploit',
      description: 'Exploit a buffer overflow vulnerability in a C program',
      points: 200,
      difficulty: 'intermediate',
      category: 'Binary Exploitation',
      requirements: ['C programming', 'Assembly basics', 'GDB'],
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 'vuln-003',
      name: 'Cryptographic Challenge',
      description: 'Break weak encryption and implement secure alternatives',
      points: 150,
      difficulty: 'intermediate',
      category: 'Cryptography',
      requirements: ['Math background', 'Python programming'],
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  // Mock users data - in real app, this would come from your backend
  const [users] = useState([
    {
      id: '1',
      schoolId: 'CS001',
      name: 'Alice Johnson',
      email: 'alice@school.edu',
      role: 'student' as const,
      points: 1250,
      level: 3,
      joinDate: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      completedActivities: ['vuln-001', 'vuln-002'],
      pendingSubmissions: [],
      approvedSubmissions: [],
    },
    {
      id: '2',
      schoolId: 'CS002',
      name: 'Bob Smith',
      email: 'bob@school.edu',
      role: 'student' as const,
      points: 1180,
      level: 3,
      joinDate: new Date('2024-01-20'),
      lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      completedActivities: ['vuln-001'],
      pendingSubmissions: ['sub-001'],
      approvedSubmissions: [],
    },
    {
      id: '3',
      schoolId: 'CS003',
      name: 'Carol Davis',
      email: 'carol@school.edu',
      role: 'student' as const,
      points: 1100,
      level: 2,
      joinDate: new Date('2024-02-01'),
      lastActive: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      completedActivities: ['vuln-001'],
      pendingSubmissions: [],
      approvedSubmissions: ['sub-002'],
    },
  ]);

  const handleSubmissionSubmit = (submission: any) => {
    console.log('New submission:', submission);
    // In real app, submit to backend
    setShowSubmissionForm(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 font-body flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">Access Denied</h1>
          <p className="text-neutral-400 mb-6">Please sign in to access the platform</p>
          <Button
            className="btn-professional btn-primary"
            onClick={() => window.location.href = '/auth'}
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Show loading while user data is being fetched
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 font-body flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-neutral-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body">
      {/* OGL RippleGrid Background */}
      <div className="fixed inset-0 z-0">
        <RippleGridV2
          enableRainbow={false}
          gridColor="#a855f7" // Purple grid
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          fadeDistance={1.5}
          vignetteStrength={2.0}
          glowIntensity={0.1}
          opacity={0.3} // Visible but not overwhelming
          gridRotation={0}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
        />
      </div>
      
      {/* Clean Background - No Green Effects */}
      <div className="fixed inset-0 bg-black" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-neutral-700/30 bg-black/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="professional-glow">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary font-display professional-glow">
            VulHub Scoreboard
          </h1>
        </div>

              {/* Navigation */}
              <nav className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-800/50" onClick={() => window.location.href = '/community'}>
                  <Users className="h-4 w-4 mr-2" />
                  Community
                </Button>
                <Button variant="outline" size="sm" className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-800/50">
                  <Target className="h-4 w-4 mr-2" />
                  Challenges
                </Button>
                <Button variant="outline" size="sm" className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-800/50">
                  <Award className="h-4 w-4 mr-2" />
                  Badges
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-800/50"
                  onClick={() => setShowSubmissionForm(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Submit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-800/50"
                  onClick={() => window.location.href = '/resources'}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Resources
                </Button>
                <div className="flex items-center space-x-2 px-3 py-2 bg-neutral-800/50 border border-neutral-600/30 rounded">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-mono font-bold text-xs">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-xs">
                    <div className="text-primary font-mono font-bold">{user?.name}</div>
                    <div className="text-neutral-300 font-mono">{user?.points} pts</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-800/50"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Spectacular Live Leaderboard Section - The Star of the Show */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SpectacularLeaderboard
              users={users}
              currentUser={user}
              title="Live Rankings"
              showLiveIndicator={true}
            />
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              {/* Main Headlines */}
        <h1 className="text-6xl font-bold text-primary font-display mb-6 professional-glow fade-in">
          Master Cybersecurity
        </h1>
        <h2 className="text-4xl font-bold text-secondary font-display mb-8 subtle-glow slide-up">
          Through Competition
        </h2>
              
              <p className="text-xl text-neutral-300 mb-12 max-w-4xl mx-auto font-body leading-relaxed">
                Join the ultimate cybersecurity learning platform where students compete, 
                learn, and grow through real-world vulnerability challenges. 
                Climb the rankings and prove your skills in the digital battlefield.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button className="btn-professional btn-primary text-lg px-8 py-4 hover-lift">
                  <Zap className="h-6 w-6 mr-3" />
                  Start Competing
                </Button>
                <Button className="btn-professional btn-secondary text-lg px-8 py-4 hover-lift">
                  <Trophy className="h-6 w-6 mr-3" />
                  View Rankings
                </Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card variant="matrix" hover glow className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-400 font-mono mb-3">
                    COMPETITIVE LEARNING
                  </h3>
                  <p className="text-gray-300 font-mono text-sm leading-relaxed">
                    Compete with fellow hackers on real vulnerability challenges 
                    and climb the scoreboards to prove your skills.
                  </p>
                </CardContent>
              </Card>

              <Card variant="matrix" hover glow className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-400 font-mono mb-3">
                    COMMUNITY DRIVEN
                  </h3>
                  <p className="text-gray-300 font-mono text-sm leading-relaxed">
                    Learn from and collaborate with a community of cybersecurity 
                    enthusiasts and experienced hackers.
                  </p>
                </CardContent>
              </Card>

              <Card variant="matrix" hover glow className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Sword className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-400 font-mono mb-3">
                    REAL CHALLENGES
                  </h3>
                  <p className="text-gray-300 font-mono text-sm leading-relaxed">
                    Practice on real-world vulnerabilities and hone your 
                    practical hacking skills in a controlled environment.
                  </p>
                </CardContent>
              </Card>

              <Card variant="matrix" hover glow className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-400 font-mono mb-3">
                    ACHIEVEMENT SYSTEM
                  </h3>
                  <p className="text-gray-300 font-mono text-sm leading-relaxed">
                    Earn badges and achievements as you progress through 
                    different skill levels and complete challenges.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-green-500/30 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="text-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                  <Trophy className="h-6 w-6 text-green-400" />
                </div>
                <span className="text-xl font-bold text-green-400 font-mono">
                  VulHub Scoreboard
                </span>
              </div>
              <p className="text-gray-400 font-mono text-sm">
                © 2025 CSUSB Cybersecurity Program. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <SubmissionForm
              activities={activities}
              onSubmit={handleSubmissionSubmit}
              onCancel={() => setShowSubmissionForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
