/**
 * ChallengeFilters Component
 * 
 * Filter and sort controls for challenge display
 */

import React from 'react';
import { ChallengeFilterOptions, Difficulty } from '../../lib/challenges/types';
import { Search, X, Filter } from 'lucide-react';

interface ChallengeFiltersProps {
  filters: ChallengeFilterOptions;
  onFiltersChange: (filters: ChallengeFilterOptions) => void;
  categories: string[];
  routes: string[];
  totalCount: number;
  filteredCount: number;
}

const ChallengeFilters: React.FC<ChallengeFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  routes,
  totalCount,
  filteredCount
}) => {
  const updateFilter = <K extends keyof ChallengeFilterOptions>(
    key: K,
    value: ChallengeFilterOptions[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      category: 'all',
      difficulty: 'all',
      route: 'all',
      sortBy: 'title',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters =
    filters.searchQuery ||
    (filters.category && filters.category !== 'all') ||
    (filters.difficulty && filters.difficulty !== 'all') ||
    (filters.route && filters.route !== 'all');

  return (
    <div className="matrix-card p-card-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-matrix" />
          <h2 className="text-xl font-display font-bold text-matrix">Filters</h2>
        </div>
        <div className="text-sm text-muted">
          Showing <span className="text-matrix font-bold">{filteredCount}</span> of{' '}
          <span className="text-bright font-bold">{totalCount}</span> challenges
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
        <input
          type="text"
          placeholder="Search challenges, CVEs, tags..."
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
        <div className="lg:col-span-2">
          <label className="block text-xs text-muted mb-1 font-semibold">Category</label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="
              w-full px-3 py-2 bg-neutral-900 border border-neutral-700
              rounded-lg text-bright
              focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix
              transition-all cursor-pointer
            "
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs text-muted mb-1 font-semibold">Difficulty</label>
          <select
            value={filters.difficulty || 'all'}
            onChange={(e) => updateFilter('difficulty', e.target.value as Difficulty | 'all')}
            className="
              w-full px-3 py-2 bg-neutral-900 border border-neutral-700
              rounded-lg text-bright
              focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix
              transition-all cursor-pointer
            "
          >
            <option value="all">All Levels</option>
            <option value="beginner">🟢 Beginner</option>
            <option value="intermediate">🟡 Intermediate</option>
            <option value="advanced">🟠 Advanced</option>
            <option value="expert">🔴 Expert</option>
          </select>
        </div>

        {/* Route */}
        <div>
          <label className="block text-xs text-muted mb-1 font-semibold">Route</label>
          <select
            value={filters.route || 'all'}
            onChange={(e) => updateFilter('route', e.target.value)}
            className="
              w-full px-3 py-2 bg-neutral-900 border border-neutral-700
              rounded-lg text-bright
              focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix
              transition-all cursor-pointer
            "
          >
            <option value="all">All Routes</option>
            <option value="standard">🎯 Standard</option>
            <option value="redTeam">⚔️ Red Team</option>
            <option value="blueTeam">🛡️ Blue Team</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs text-muted mb-1 font-semibold">Sort By</label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy || 'title'}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="
                flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700
                rounded-lg text-bright
                focus:border-matrix focus:outline-none focus:ring-1 focus:ring-matrix
                transition-all cursor-pointer
              "
            >
              <option value="title">Title</option>
              <option value="points">Points</option>
              <option value="difficulty">Difficulty</option>
              <option value="category">Category</option>
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

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            onClick={clearFilters}
            className="matrix-button matrix-button-outline flex items-center gap-2 text-sm"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ChallengeFilters;

