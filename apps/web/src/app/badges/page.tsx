/**
 * Badges Page - Modular & Redesigned
 * 
 * Displays user badge collection with advanced filtering,
 * stats, and detailed badge information
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/context';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import RippleGridV2 from '../../components/RippleGrid/RippleGridV2';
import { Badge, BadgeFilterOptions } from '../../lib/badges/types';
import { initializeBadges, filterBadges, calculateBadgeStats, getRecentlyUnlockedBadges, getBadgesNearCompletion } from '../../lib/badges/utils';
import { BadgeCard, BadgeFilters, BadgeStats, BadgeModal } from '../../components/badges';

export default function BadgesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // State
  const [badges, setBadges] = useState<Badge[]>([]);
  const [filters, setFilters] = useState<BadgeFilterOptions>({
    searchQuery: '',
    category: 'all',
    tier: 'all',
    rarity: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize badges on mount
  useEffect(() => {
    // In a real app, you'd fetch user progress from the backend
    const initializedBadges = initializeBadges();
    setBadges(initializedBadges);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Compute filtered badges and stats
  const filteredBadgesList = filterBadges(badges, filters);
  const stats = calculateBadgeStats(badges);
  const recentlyUnlocked = getRecentlyUnlockedBadges(badges, 3);
  const nearCompletion = getBadgesNearCompletion(badges, 70);

  // Handle badge click
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body relative">
      {/* RippleGrid Background */}
      <div className="fixed inset-0 z-0">
        <RippleGridV2
          enableRainbow={false}
          gridColor="var(--color-matrix-500)"
          rippleIntensity={0.03}
          gridSize={10}
          gridThickness={12}
          fadeDistance={1.5}
          vignetteStrength={1.6}
          glowIntensity={0.08}
          opacity={0.08}
          gridRotation={0}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 header-surface backdrop-blur-md border-b border-neutral-800">
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
              <h1 className="text-4xl font-display font-bold text-matrix-glow mb-2 flex items-center gap-3">
                <Sparkles className="h-8 w-8 animate-bounce-subtle" />
                Badge Gallery
              </h1>
              <p className="text-muted text-lg">
                Unlock achievements by completing VulHub challenges
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Badge Stats */}
        <BadgeStats stats={stats} animated={true} />

        {/* Recently Unlocked & Near Completion */}
        {(recentlyUnlocked.length > 0 || nearCompletion.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recently Unlocked */}
            {recentlyUnlocked.length > 0 && (
              <div className="matrix-card p-card-md">
                <h3 className="text-xl font-display font-bold text-matrix-glow mb-4">
                  Recently Unlocked ✨
                </h3>
                <div className="space-y-3">
                  {recentlyUnlocked.map(badge => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-4 bg-neutral-900/50 rounded-lg p-3 border border-matrix/30 hover-lift cursor-pointer"
                      onClick={() => handleBadgeClick(badge)}
                    >
                      <div className="text-3xl">{badge.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-bright">{badge.name}</h4>
                        <p className="text-xs text-muted">
                          {badge.unlockedAt?.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-matrix">+{badge.points} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Near Completion */}
            {nearCompletion.length > 0 && (
              <div className="matrix-card p-card-md">
                <h3 className="text-xl font-display font-bold text-yellow-400 mb-4">
                  Almost There! 🔥
                </h3>
                <div className="space-y-3">
                  {nearCompletion.map(badge => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-4 bg-neutral-900/50 rounded-lg p-3 border border-yellow-500/30 hover-lift cursor-pointer animate-matrix-pulse-border"
                      onClick={() => handleBadgeClick(badge)}
                    >
                      <div className="text-3xl opacity-70">{badge.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-bright">{badge.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-scan-line-progress"
                              style={{ width: `${badge.requirements.reduce((sum, req) => sum + (req.progress / req.target * 100), 0) / badge.requirements.length}%` }}
                            />
                          </div>
                          <span className="text-xs text-yellow-400 font-bold">
                            {Math.floor(badge.requirements.reduce((sum, req) => sum + (req.progress / req.target * 100), 0) / badge.requirements.length)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <BadgeFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalCount={badges.length}
          filteredCount={filteredBadgesList.length}
        />

        {/* Badge Grid */}
        <div>
          {filteredBadgesList.length === 0 ? (
            <div className="matrix-card p-12 text-center">
              <div className="text-6xl mb-4 opacity-30">🔍</div>
              <h3 className="text-2xl font-display font-bold text-bright mb-2">
                No Badges Found
              </h3>
              <p className="text-muted">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBadgesList.map((badge, index) => (
                <div
                  key={badge.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <BadgeCard
                    badge={badge}
                    onClick={handleBadgeClick}
                    showProgress={true}
                    size="medium"
                    animated={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <BadgeModal
        badge={selectedBadge}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBadge(null);
        }}
      />
    </div>
  );
}
