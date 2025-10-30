'use client';

import { Button } from '@vulhub/ui';
import { UnifiedIcon, Terminology, VisualEffect } from '@vulhub/ui';
import { Trophy, Users, Target, Award } from 'lucide-react';

interface BannerProps {
  className?: string;
}

export function Banner({ className = '' }: BannerProps) {
  return (
    <header className={`border-b bg-black/90 backdrop-blur-sm border-green-500/30 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <VisualEffect type="neon">
              <UnifiedIcon name="trophy" size={32} className="text-green-400" />
            </VisualEffect>
            <h1 className="text-2xl font-bold text-green-400 font-mono">
              <Terminology>VulHub Leaderboard</Terminology>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono"
            >
              <Users className="h-4 w-4 mr-2" />
              <Terminology>Community</Terminology>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono"
            >
              <Target className="h-4 w-4 mr-2" />
              <Terminology>Challenges</Terminology>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono"
            >
              <Award className="h-4 w-4 mr-2" />
              <Terminology>Badges</Terminology>
            </Button>
            <Button 
              size="sm" 
              className="bg-green-500 hover:bg-green-600 text-black font-mono font-bold"
            >
              <Terminology>Sign In</Terminology>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
