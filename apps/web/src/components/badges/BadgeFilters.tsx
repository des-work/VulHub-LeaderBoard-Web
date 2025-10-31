/**
 * BadgeFilters Component
 * 
 * Filter and sort controls for badge display
 */

import React from 'react';
import { BadgeFilterOptions, BadgeCategory, BadgeTier, BadgeRarity } from '../../lib/badges/types';
import { Search, X } from 'lucide-react';

interface BadgeFiltersProps {
  filters: BadgeFilterOptions;
  onFiltersChange: (filters: BadgeFilterOptions) => void;
  totalCount: number;
  filteredCount: number;
}

const BadgeFilters: React.FC<BadgeFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount
}) => {
  const updateFilter = <K extends keyof BadgeFilterOptions>(
    key: K,
    value: BadgeFilterOptions[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      category: 'all',
      tier: 'all',
      rarity: 'all',
      status: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = 
    filters.searchQuery ||
    (filters.category && filters.category !== 'all') ||
    (filters.tier && filters.tier !== 'all') ||
    (filters.rarity && filters.rarity !== 'all') ||
    (filters.status && filters.status !== 'all');

  return (
    <div className="matrix-card p-card-md space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
        <input
          type="text"
          placeholder="Search badges..."
          value={filters.searchQuery || ''}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          className="
            w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700
            rounded-lg text-bright placeholder-dim
            focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix
            transition-all
          "
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Category */}
        <div>
          <label className="block text-xs text-muted mb-1 font-semibold">Category</label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => updateFilter('category', e.target.value as BadgeCategory | 'all')}
            className="
              w-full px-3 py-2 bg-neutral-900 border border-neutral-700
              rounded-lg text-bright
              focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix
              transition-all cursor-pointer
            "
          >
            <option value="all">All Categories</option>
            <option value="challenge">🎯 Challenge</option>
            <option value="streak">🔥 Streak</option>
            <option value="milestone">📊 Milestone</option>
            <option value="special">⭐ Special</option>
            <option value="achievement">🏆 Achievement</option>
          </select>
        </div>

        {/* Tier */}
        <div>
          <label className="block text-xs text-muted mb-1 font-semibold">Tier</label>
          <select
            value={filters.tier || 'all'}
            onChange={(e) => updateFilter('tier', e.target.value as BadgeTier | 'all')}
            className="
              w-full px-3 py-2 bg-neutral-900 border border-neutral-700
              rounded-lg text-bright
              focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix
              transition-all cursor-pointer
            "
          >
            <option value="all">All Tiers</option>
            <option value="bronze">🥉 Bronze</option>
            <option value="silver">🥈 Silver</option>
            <option value="gold">🥇 Gold</option>
            <option value="platinum">💠 Platinum</option>
            <option value="diamond">💎 Diamond</option>
          </select>
        </div>

        {/* Rarity */}
        <div>
          <label className="block text-xs text-muted mb-1 font-semibold">Rarity</label>
          <select
            value={filters.rarity || 'all'}
            onChange={(e) => updateFilter('rarity', e.target.value as BadgeRarity | 'all')}
            className="
              w-full px-3 py-2 bg-neutral-900 border border-neutral-700
              rounded-lg text-bright
              focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix
              transition-all cursor-pointer
            "
          >
            <option value="all">All Rarities</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs text-muted mb-1 font-semibold">Status</label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => updateFilter('status', e.target.value as 'all' | 'unlocked' | 'locked')}
            className="
              w-full px-3 py-2 bg-neutral-900 border border-neutral-700
              rounded-lg text-bright
              focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix
              transition-all cursor-pointer
            "
          >
            <option value="all">All Badges</option>
            <option value="unlocked">✅ Unlocked</option>
            <option value="locked">🔒 Locked</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs text-muted mb-1 font-semibold">Sort By</label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy || 'name'}
              onChange={(e) => updateFilter('sortBy', e.target.value as 'name' | 'points' | 'rarity' | 'progress')}
              className="
                flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700
                rounded-lg text-bright
                focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix
                transition-all cursor-pointer
              "
            >
              <option value="name">Name</option>
              <option value="points">Points</option>
              <option value="rarity">Rarity</option>
              <option value="progress">Progress</option>
            </select>
            <button
              onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="
                px-3 py-2 bg-neutral-900 border border-neutral-700
                rounded-lg text-bright hover:bg-neutral-800
                transition-all
              "
              title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Results & Clear */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
        <p className="text-sm text-muted">
          Showing <span className="text-matrix font-bold">{filteredCount}</span> of <span className="text-bright font-bold">{totalCount}</span> badges
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="matrix-button matrix-button-outline flex items-center gap-2 text-sm"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default BadgeFilters;

