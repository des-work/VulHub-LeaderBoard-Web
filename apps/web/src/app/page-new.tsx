'use client';

/**
 * New Home Page
 * Clean, modular implementation using the new UI system
 */

import React from 'react';
import { Button } from '../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../lib/ui/card';
import { useThemeValue } from '../lib/theme/context';
import { Trophy, Users, Target, Award, Zap, Shield, Sword, Crown, Medal } from 'lucide-react';

export default function HomePage() {
  const theme = useThemeValue();

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

        {/* Live Leaderboard Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card variant="matrix" glow className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-green-400 font-mono flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="h-6 w-6 mr-3" />
                    Live Rankings
                  </div>
                  <div className="flex items-center text-sm text-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Live
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Top 3 Rankings */}
                  <div className="flex items-center space-x-4 p-4 bg-green-500/5 border border-green-500/20 rounded">
                    <div className="flex items-center justify-center w-8">
                      <Crown className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-mono font-bold text-lg">
                      AJ
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-green-400 font-mono font-bold text-lg">Alice Johnson</h3>
                      <p className="text-xs text-gray-400 font-mono">Last active: 2 min ago</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-green-400">1,250</div>
                      <div className="text-xs text-gray-400 font-mono">points</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-900/30 rounded">
                    <div className="flex items-center justify-center w-8">
                      <Medal className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-mono font-bold text-lg">
                      BS
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-green-400 font-mono font-bold text-lg">Bob Smith</h3>
                      <p className="text-xs text-gray-400 font-mono">Last active: 5 min ago</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-yellow-400">1,180</div>
                      <div className="text-xs text-gray-400 font-mono">points</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-900/30 rounded">
                    <div className="flex items-center justify-center w-8">
                      <Medal className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-mono font-bold text-lg">
                      CD
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-green-400 font-mono font-bold text-lg">Carol Davis</h3>
                      <p className="text-xs text-gray-400 font-mono">Last active: 1 hour ago</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-orange-400">1,100</div>
                      <div className="text-xs text-gray-400 font-mono">points</div>
                    </div>
                  </div>
                </div>

                {/* View All Button */}
                <div className="mt-6 pt-4 border-t border-green-500/20">
                  <Button variant="matrix" className="w-full">
                    View Full Scoreboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

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
    </div>
  );
}
