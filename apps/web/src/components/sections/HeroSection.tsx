'use client';

import { Button } from '@vulhub/ui';
import { UnifiedIcon, Terminology, VisualEffect } from '@vulhub/ui';
import { Trophy, Users, Target, Award, Zap, Shield, Sword } from 'lucide-react';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = '' }: HeroSectionProps) {
  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Main Hero Content */}
        <div className="text-center mb-16">
          <VisualEffect type="neon">
            <h1 className="text-6xl font-bold text-green-400 font-mono mb-6">
              <Terminology>MASTER CYBERSECURITY</Terminology>
            </h1>
          </VisualEffect>
          <VisualEffect type="glow">
            <h2 className="text-4xl font-bold text-green-300 font-mono mb-8">
              <Terminology>THROUGH COMPETITION</Terminology>
            </h2>
          </VisualEffect>
          
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto font-mono leading-relaxed">
            <Terminology>
              Join the ultimate cybersecurity learning platform where hackers compete, 
              learn, and grow through real-world vulnerability challenges. 
              Climb the rankings and prove your skills in the digital battlefield.
            </Terminology>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-600 text-black font-mono font-bold text-lg px-8 py-4 border-2 border-green-400 hover:border-green-300 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
            >
              <Zap className="h-6 w-6 mr-3" />
              <Terminology>START HACKING NOW</Terminology>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-green-500 text-green-400 hover:bg-green-500/10 font-mono font-bold text-lg px-8 py-4 transition-all duration-300 hover:border-green-400"
            >
              <Trophy className="h-6 w-6 mr-3" />
              <Terminology>VIEW RANKINGS</Terminology>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Competitive Learning */}
          <div className="group">
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 text-center hover:border-green-500/60 transition-all duration-300 hover:bg-green-500/5">
              <VisualEffect type="neon">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors duration-300">
                  <UnifiedIcon name="castle" size={32} className="text-green-400" />
                </div>
              </VisualEffect>
              <h3 className="text-xl font-bold text-green-400 font-mono mb-3">
                <Terminology>COMPETITIVE LEARNING</Terminology>
              </h3>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                <Terminology>
                  Compete with fellow hackers on real vulnerability challenges 
                  and climb the leaderboards to prove your skills.
                </Terminology>
              </p>
            </div>
          </div>

          {/* Community Driven */}
          <div className="group">
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 text-center hover:border-green-500/60 transition-all duration-300 hover:bg-green-500/5">
              <VisualEffect type="neon">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors duration-300">
                  <UnifiedIcon name="shield" size={32} className="text-green-400" />
                </div>
              </VisualEffect>
              <h3 className="text-xl font-bold text-green-400 font-mono mb-3">
                <Terminology>COMMUNITY DRIVEN</Terminology>
              </h3>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                <Terminology>
                  Learn from and collaborate with a community of cybersecurity 
                  enthusiasts and experienced hackers.
                </Terminology>
              </p>
            </div>
          </div>

          {/* Real Challenges */}
          <div className="group">
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 text-center hover:border-green-500/60 transition-all duration-300 hover:bg-green-500/5">
              <VisualEffect type="neon">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors duration-300">
                  <UnifiedIcon name="sword" size={32} className="text-green-400" />
                </div>
              </VisualEffect>
              <h3 className="text-xl font-bold text-green-400 font-mono mb-3">
                <Terminology>REAL CHALLENGES</Terminology>
              </h3>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                <Terminology>
                  Practice on real-world vulnerabilities and hone your 
                  practical hacking skills in a controlled environment.
                </Terminology>
              </p>
            </div>
          </div>

          {/* Achievement System */}
          <div className="group">
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 text-center hover:border-green-500/60 transition-all duration-300 hover:bg-green-500/5">
              <VisualEffect type="neon">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors duration-300">
                  <UnifiedIcon name="award" size={32} className="text-green-400" />
                </div>
              </VisualEffect>
              <h3 className="text-xl font-bold text-green-400 font-mono mb-3">
                <Terminology>ACHIEVEMENT SYSTEM</Terminology>
              </h3>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                <Terminology>
                  Earn badges and achievements as you progress through 
                  different skill levels and complete challenges.
                </Terminology>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
