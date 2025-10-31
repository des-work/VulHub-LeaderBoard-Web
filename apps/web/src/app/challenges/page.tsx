/**
 * Challenges Page - Modular & Redesigned
 * 
 * Browse and filter VulHub challenges with advanced filtering and statistics
 */

"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import RippleGridV2 from '../../components/RippleGrid/RippleGridV2';
import { challengeCatalog } from '../../lib/challenges/catalog';
import { Challenge } from '../../lib/challenges/types';
import {
  filterChallenges,
  calculateChallengeStats,
  getUniqueCategories,
  getUniqueRoutes,
  ChallengeFilterOptions
} from '../../lib/challenges/utils';
import { ChallengeCard, ChallengeFilters, ChallengeStats } from '../../components/challenges';

export default function ChallengesPage() {
  const router = useRouter();

  // State
  const [filters, setFilters] = useState<ChallengeFilterOptions>({
    searchQuery: '',
    category: 'all',
    difficulty: 'all',
    route: 'all',
    sortBy: 'title',
    sortOrder: 'asc'
  });

  // Memoized data
  const challenges = useMemo(() => challengeCatalog.challenges, []);
  const categories = useMemo(() => getUniqueCategories(challenges), [challenges]);
  const routes = useMemo(() => getUniqueRoutes(challenges), [challenges]);
  const filteredChallenges = useMemo(() => 
    filterChallenges(challenges, filters), 
    [challenges, filters]
  );
  const stats = useMemo(() => calculateChallengeStats(challenges), [challenges]);

  // Handle challenge start
  const handleStartChallenge = (challenge: Challenge) => {
    // In production, this would navigate to the challenge detail page
    // For now, just show an alert
    alert(`Starting challenge: ${challenge.title}\n\nThis would normally navigate to the challenge workspace.`);
    // router.push(`/challenges/${challenge.id}`);
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
                VulHub Challenges
              </h1>
              <p className="text-muted text-lg">
                Practice real-world vulnerabilities in isolated environments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Statistics */}
        <ChallengeStats stats={stats} animated={true} />

        {/* Filters */}
        <ChallengeFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          routes={routes}
          totalCount={challenges.length}
          filteredCount={filteredChallenges.length}
        />

        {/* Challenge Grid */}
        <div>
          {filteredChallenges.length === 0 ? (
            <div className="matrix-card p-12 text-center">
              <div className="text-6xl mb-4 opacity-30">🔍</div>
              <h3 className="text-2xl font-display font-bold text-bright mb-2">
                No Challenges Found
              </h3>
              <p className="text-muted">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-bright">
                  {filteredChallenges.length === challenges.length 
                    ? 'All Challenges' 
                    : `${filteredChallenges.length} ${filteredChallenges.length === 1 ? 'Challenge' : 'Challenges'}`
                  }
                </h2>
                <div className="text-sm text-muted">
                  {filters.sortBy && (
                    <span>
                      Sorted by {filters.sortBy} ({filters.sortOrder === 'asc' ? 'ascending' : 'descending'})
                    </span>
                  )}
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge, index) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onStart={handleStartChallenge}
                    showRoutes={true}
                    showTags={true}
                    animated={true}
                    animationDelay={index * 50}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
