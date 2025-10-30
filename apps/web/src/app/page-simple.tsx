'use client';

import React from 'react';
import { Button } from '../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../lib/ui/card';
import { Trophy, Users, Target, Award, Zap, Shield, Sword, Crown, Medal } from 'lucide-react';

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Matrix Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-green-900/5 to-black" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,255,0,0.1)_0%,transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,255,0,0.1)_0%,transparent_50%)]" />
      
      {/* Scan Lines Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.03)_50%)] bg-[length:100%_4px] animate-pulse pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-green-500/30 bg-black/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="text-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                  <Trophy className="h-8 w-8 text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-green-400 font-mono">
                  VulHub Scoreboard
                </h1>
              </div>

              {/* Navigation */}
              <nav className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                  <Users className="h-4 w-4 mr-2" />
                  Community
                </Button>
                <Button variant="outline" size="sm" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                  <Target className="h-4 w-4 mr-2" />
                  Challenges
                </Button>
                <Button variant="outline" size="sm" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                  <Award className="h-4 w-4 mr-2" />
                  Badges
                </Button>
                <Button variant="matrix" size="sm">
                  Sign In
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              {/* Main Headlines */}
              <h1 className="text-6xl font-bold text-green-400 font-mono mb-6 text-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                MASTER CYBERSECURITY
              </h1>
              <h2 className="text-4xl font-bold text-green-300 font-mono mb-8 text-shadow-[0_0_5px_rgba(0,255,0,0.3)]">
                THROUGH COMPETITION
              </h2>
              
              <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto font-mono leading-relaxed">
                Join the ultimate cybersecurity learning box where hackers compete, 
                learn, and grow through real-world vuln challenges. 
                Climb the rankings and prove your skills in the digital battlefield.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button variant="neon" size="xl" className="text-lg px-8 py-4">
                  <Zap className="h-6 w-6 mr-3" />
                  START HACKING NOW
                </Button>
                <Button variant="matrix" size="xl" className="text-lg px-8 py-4">
                  <Trophy className="h-6 w-6 mr-3" />
                  VIEW RANKINGS
                </Button>
              </div>
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
    </div>
  );
}
