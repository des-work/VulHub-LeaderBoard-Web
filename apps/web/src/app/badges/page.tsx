'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/context';
import { useRouter } from 'next/navigation';
import { 
  Trophy, 
  Star, 
  Shield, 
  Zap, 
  Target, 
  Award, 
  Lock, 
  Unlock,
  CheckCircle,
  Clock,
  Flame,
  Crown,
  Gem,
  Sparkles,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import RippleGridV2 from '../../components/RippleGrid/RippleGridV2';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: 'challenge' | 'milestone' | 'special' | 'achievement';
  requirements: {
    type: 'challenges' | 'points' | 'streak' | 'special';
    value: number;
    description: string;
  };
  points: number;
  isUnlocked: boolean;
  progress: number;
  challengeId?: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const BADGES: BadgeData[] = [
  // Challenge Completion Badges
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Complete your first VulHub challenge',
    icon: '🩸',
    tier: 'bronze',
    category: 'challenge',
    requirements: { type: 'challenges', value: 1, description: 'Complete 1 challenge' },
    points: 50,
    isUnlocked: false,
    progress: 0,
    rarity: 'common'
  },
  {
    id: 'bug-hunter',
    name: 'Bug Hunter',
    description: 'Find and exploit 5 vulnerabilities',
    icon: '🐛',
    tier: 'silver',
    category: 'challenge',
    requirements: { type: 'challenges', value: 5, description: 'Complete 5 challenges' },
    points: 200,
    isUnlocked: false,
    progress: 0,
    rarity: 'rare'
  },
  {
    id: 'code-master',
    name: 'Code Master',
    description: 'Master 10 different vulnerability types',
    icon: '💻',
    tier: 'gold',
    category: 'challenge',
    requirements: { type: 'challenges', value: 10, description: 'Complete 10 challenges' },
    points: 500,
    isUnlocked: false,
    progress: 0,
    rarity: 'epic'
  },
  {
    id: 'security-expert',
    name: 'Security Expert',
    description: 'Complete 25 challenges across all categories',
    icon: '🛡️',
    tier: 'platinum',
    category: 'challenge',
    requirements: { type: 'challenges', value: 25, description: 'Complete 25 challenges' },
    points: 1000,
    isUnlocked: false,
    progress: 0,
    rarity: 'legendary'
  },

  // Specific Challenge Badges
  {
    id: 'nextjs-ninja',
    name: 'Next.js Ninja',
    description: 'Master Next.js middleware vulnerabilities',
    icon: '⚡',
    tier: 'silver',
    category: 'challenge',
    requirements: { type: 'challenges', value: 1, description: 'Complete Next.js challenge' },
    points: 150,
    isUnlocked: false,
    progress: 0,
    challengeId: 'nextjs-middleware',
    rarity: 'rare'
  },
  {
    id: 'llm-hacker',
    name: 'LLM Hacker',
    description: 'Exploit AI/ML vulnerabilities like a pro',
    icon: '🤖',
    tier: 'gold',
    category: 'challenge',
    requirements: { type: 'challenges', value: 1, description: 'Complete Langflow challenge' },
    points: 250,
    isUnlocked: false,
    progress: 0,
    challengeId: 'langflow-rce',
    rarity: 'epic'
  },
  {
    id: 'database-destroyer',
    name: 'Database Destroyer',
    description: 'Pwn databases with advanced techniques',
    icon: '🗄️',
    tier: 'silver',
    category: 'challenge',
    requirements: { type: 'challenges', value: 1, description: 'Complete H2 challenge' },
    points: 180,
    isUnlocked: false,
    progress: 0,
    challengeId: 'h2-console-rce',
    rarity: 'rare'
  },
  {
    id: 'expression-master',
    name: 'Expression Master',
    description: 'Master OGNL and SpEL injection techniques',
    icon: '⚡',
    tier: 'gold',
    category: 'challenge',
    requirements: { type: 'challenges', value: 2, description: 'Complete 2 expression injection challenges' },
    points: 380,
    isUnlocked: false,
    progress: 0,
    rarity: 'epic'
  },
  {
    id: 'privilege-escalator',
    name: 'Privilege Escalator',
    description: 'Escalate privileges like a true hacker',
    icon: '⬆️',
    tier: 'gold',
    category: 'challenge',
    requirements: { type: 'challenges', value: 1, description: 'Complete privilege escalation challenge' },
    points: 200,
    isUnlocked: false,
    progress: 0,
    challengeId: 'postgresql-privesc',
    rarity: 'epic'
  },
  {
    id: 'cms-crusher',
    name: 'CMS Crusher',
    description: 'Exploit content management systems',
    icon: '💥',
    tier: 'bronze',
    category: 'challenge',
    requirements: { type: 'challenges', value: 1, description: 'Complete Drupal challenge' },
    points: 120,
    isUnlocked: false,
    progress: 0,
    challengeId: 'drupal-xss',
    rarity: 'common'
  },

  // Milestone Badges
  {
    id: 'point-collector',
    name: 'Point Collector',
    description: 'Accumulate 1000 points through challenges',
    icon: '💰',
    tier: 'silver',
    category: 'milestone',
    requirements: { type: 'points', value: 1000, description: 'Earn 1000 points' },
    points: 100,
    isUnlocked: false,
    progress: 0,
    rarity: 'rare'
  },
  {
    id: 'high-roller',
    name: 'High Roller',
    description: 'Reach the 5000 point milestone',
    icon: '🎰',
    tier: 'gold',
    category: 'milestone',
    requirements: { type: 'points', value: 5000, description: 'Earn 5000 points' },
    points: 500,
    isUnlocked: false,
    progress: 0,
    rarity: 'epic'
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Complete challenges 5 days in a row',
    icon: '🔥',
    tier: 'silver',
    category: 'milestone',
    requirements: { type: 'streak', value: 5, description: '5-day challenge streak' },
    points: 300,
    isUnlocked: false,
    progress: 0,
    rarity: 'rare'
  },

  // Special Achievement Badges
  {
    id: 'top-performer',
    name: 'Top Performer',
    description: 'Reach the top 10 on the leaderboard',
    icon: '🏆',
    tier: 'diamond',
    category: 'achievement',
    requirements: { type: 'special', value: 1, description: 'Reach top 10 leaderboard' },
    points: 1000,
    isUnlocked: false,
    progress: 0,
    rarity: 'legendary'
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a challenge in under 30 minutes',
    icon: '⚡',
    tier: 'gold',
    category: 'achievement',
    requirements: { type: 'special', value: 1, description: 'Complete challenge in <30 min' },
    points: 200,
    isUnlocked: false,
    progress: 0,
    rarity: 'epic'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Get perfect scores on 10 challenges',
    icon: '💎',
    tier: 'platinum',
    category: 'achievement',
    requirements: { type: 'special', value: 10, description: 'Perfect scores on 10 challenges' },
    points: 800,
    isUnlocked: false,
    progress: 0,
    rarity: 'legendary'
  }
];

export default function BadgesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [badges, setBadges] = useState<BadgeData[]>(BADGES);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [category, setCategory] = useState<'all' | 'challenge' | 'milestone' | 'special' | 'achievement'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const getTierColor = (tier: BadgeData['tier']) => {
    switch (tier) {
      case 'bronze': return 'from-yellow-600 to-yellow-400';
      case 'silver': return 'from-gray-400 to-gray-200';
      case 'gold': return 'from-yellow-400 to-yellow-200';
      case 'platinum': return 'from-blue-400 to-blue-200';
      case 'diamond': return 'from-purple-400 to-pink-200';
      default: return 'from-gray-600 to-gray-400';
    }
  };

  const getRarityColor = (rarity: BadgeData['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const filteredBadges = badges.filter(badge => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unlocked' && badge.isUnlocked) || 
      (filter === 'locked' && !badge.isUnlocked);
    
    const matchesCategory = category === 'all' || badge.category === category;
    
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesCategory && matchesSearch;
  });

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const totalCount = badges.length;

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body relative">
      {/* RippleGrid Background */}
      <div className="fixed inset-0 z-0">
        <RippleGridV2
          enableRainbow={false}
          gridColor="#00ff00"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          fadeDistance={1.5}
          vignetteStrength={2.0}
          glowIntensity={0.1}
          opacity={0.3}
          gridRotation={0}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 layer-header header-surface">
        <div className="container mx-auto px-4 py-6">
          <button 
            onClick={() => router.push('/')}
            className="matrix-button matrix-button-outline mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-matrix-glow mb-2">Badge Gallery</h1>
              <p className="text-muted">Unlock badges by completing VulHub challenges and achieving milestones</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-matrix-glow">{unlockedCount}/{totalCount}</div>
              <div className="text-sm text-muted">Badges Unlocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row-surface layer-content">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-matrix rounded text-bright placeholder-muted focus:outline-none focus:border-matrix-bright"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'matrix-button matrix-button-primary' : 'matrix-button matrix-button-outline'}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unlocked')}
                className={filter === 'unlocked' ? 'matrix-button matrix-button-primary' : 'matrix-button matrix-button-outline'}
              >
                <Unlock className="h-3 w-3 mr-1" />
                Unlocked
              </button>
              <button
                onClick={() => setFilter('locked')}
                className={filter === 'locked' ? 'matrix-button matrix-button-primary' : 'matrix-button matrix-button-outline'}
              >
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="px-3 py-2 bg-neutral-800 border border-matrix rounded text-bright focus:outline-none focus:border-matrix-bright"
            >
              <option value="all">All Categories</option>
              <option value="challenge">Challenges</option>
              <option value="milestone">Milestones</option>
              <option value="special">Special</option>
              <option value="achievement">Achievements</option>
            </select>
          </div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="layer-content container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => (
            <div 
              key={badge.id} 
              className={`matrix-card hover-lift ${badge.isUnlocked ? 'border-matrix-bright matrix-glow' : 'opacity-60'}`}
            >
              <div className="p-6">
                <div className="text-center">
                  {/* Badge Icon */}
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${getTierColor(badge.tier)} flex items-center justify-center text-4xl relative`}>
                    {badge.isUnlocked ? (
                      <span className="animate-pulse">{badge.icon}</span>
                    ) : (
                      <div className="relative">
                        <span className="opacity-30">{badge.icon}</span>
                        <Lock className="absolute -top-1 -right-1 h-4 w-4 text-dim" />
                      </div>
                    )}
                    
                    {/* Rarity Indicator */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getRarityColor(badge.rarity)}`}>
                      <div className={`w-full h-full rounded-full ${getRarityColor(badge.rarity)} animate-pulse`} />
                    </div>
                  </div>

                  {/* Badge Info */}
                  <h3 className="text-lg font-semibold text-bright mb-2">{badge.name}</h3>
                  <p className="text-sm text-muted mb-4">{badge.description}</p>

                  {/* Tier Badge */}
                  <span className={`inline-block px-3 py-1 rounded-full mb-3 ${getTierColor(badge.tier)} text-black font-semibold text-xs`}>
                    {badge.tier.toUpperCase()}
                  </span>

                  {/* Progress Bar */}
                  {!badge.isUnlocked && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-dim mb-1">
                        <span>Progress</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full transition-all duration-500 matrix-glow"
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  <div className="text-xs text-dim mb-3">
                    {badge.requirements.description}
                  </div>

                  {/* Points */}
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-bright">{badge.points} points</span>
                  </div>

                  {/* Unlock Status */}
                  {badge.isUnlocked && badge.unlockedAt && (
                    <div className="mt-3 text-xs text-matrix flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Unlocked {badge.unlockedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBadges.length === 0 && (
          <div className="matrix-card col-span-full">
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-dim mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-bright mb-2">No Badges Found</h3>
              <p className="text-muted">Try adjusting your filters or search terms</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="row-surface layer-content">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="hover-lift-subtle p-4 rounded-lg">
              <div className="text-2xl font-bold text-matrix-glow">{unlockedCount}</div>
              <div className="text-sm text-muted">Unlocked</div>
            </div>
            <div className="hover-lift-subtle p-4 rounded-lg">
              <div className="text-2xl font-bold text-dim">{totalCount - unlockedCount}</div>
              <div className="text-sm text-muted">Locked</div>
            </div>
            <div className="hover-lift-subtle p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {badges.filter(b => b.tier === 'diamond' && b.isUnlocked).length}
              </div>
              <div className="text-sm text-muted">Diamond</div>
            </div>
            <div className="hover-lift-subtle p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {badges.filter(b => b.rarity === 'legendary' && b.isUnlocked).length}
              </div>
              <div className="text-sm text-muted">Legendary</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}