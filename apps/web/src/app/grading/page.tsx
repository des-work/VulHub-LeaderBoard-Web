'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../lib/auth/context';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  AlertCircle,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  User,
  Calendar,
  Zap,
  BarChart3,
} from 'lucide-react';
import RippleGridV2 from '../../components/RippleGrid/RippleGridV2';
import { GradingPermissions } from '../../lib/grading/permissions';
import { STATUS_CONFIG } from '../../lib/grading/config';
import { GradingApi } from '../../lib/api/endpoints';
import { Submission } from '../../lib/auth/types';
import { ErrorAlert } from '../../components/ErrorAlert';
import { SkeletonTable } from '../../components/common/Loading';

interface Filter {
  status: string;
  challenge?: string;
  search?: string;
}

interface SortConfig {
  key: 'date' | 'challenge' | 'student' | 'status';
  direction: 'asc' | 'desc';
}

export default function GradingDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Consolidated state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    error: '',
  });
  
  // Consolidated filter/search/sort state
  const [viewState, setViewState] = useState({
    filter: { status: 'pending' } as Filter,
    search: '',
    sort: { key: 'date' as const, direction: 'desc' as const },
  });
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [stats, setStats] = useState<{
    totalGraded: number;
    averageTime: number;
    today: number;
  }>({ totalGraded: 0, averageTime: 0, today: 0 });

  // Permission check
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    const permission = GradingPermissions.canAccessGradingInterface(user);
    if (!permission.allowed) {
      router.replace('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Load submissions
  useEffect(() => {
    if (!isAuthenticated) {return;}

    const loadSubmissions = async () => {
      try {
        setLoadingState({ isLoading: true, error: '' });
        
        const queue = await GradingApi.getGradingQueue();
        setSubmissions(queue);

        const graderStats = await GradingApi.getGraderStats();
        setStats({
          totalGraded: graderStats.totalGraded,
          averageTime: graderStats.averageTimeMinutes,
          today: graderStats.todayCount,
        });
      } catch (err: any) {
        setLoadingState({ isLoading: false, error: err.message || 'Failed to load submissions' });
      } finally {
        setLoadingState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadSubmissions();
  }, [isAuthenticated]);

  // Computed filtered and sorted submissions (useMemo instead of useEffect)
  const filteredSubmissions = useMemo(() => {
    const filtered = submissions.filter(sub => {
      // Status filter
      if (viewState.filter.status && sub.status !== viewState.filter.status) {
        return false;
      }

      // Search filter
      if (viewState.search) {
        const searchLower = viewState.search.toLowerCase();
        const studentName = (sub as any).studentName?.toLowerCase() || '';
        const challengeName = (sub as any).challengeName?.toLowerCase() || '';
        
        return studentName.includes(searchLower) || challengeName.includes(searchLower);
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (viewState.sort.key) {
        case 'date':
          aVal = new Date(a.submittedAt || 0).getTime();
          bVal = new Date(b.submittedAt || 0).getTime();
          break;
        case 'challenge':
          aVal = (a as any).challengeName || '';
          bVal = (b as any).challengeName || '';
          break;
        case 'student':
          aVal = (a as any).studentName || '';
          bVal = (b as any).studentName || '';
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) {return viewState.sort.direction === 'asc' ? -1 : 1;}
      if (aVal > bVal) {return viewState.sort.direction === 'asc' ? 1 : -1;}
      return 0;
    });

    return filtered;
  }, [submissions, viewState.filter.status, viewState.search, viewState.sort]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'under_review': return <Eye className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'needs_revision': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    if (!config) {return 'gray';}
    return config.color;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredSubmissions.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectSubmission = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedIds);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleSort = (key: SortConfig['key']) => {
    setViewState(prev => {
      if (prev.sort.key === key) {
        return {
          ...prev,
          sort: { ...prev.sort, direction: prev.sort.direction === 'asc' ? 'desc' : 'asc' }
        };
      } else {
        return {
          ...prev,
          sort: { key, direction: 'desc' }
        };
      }
    });
  };

  // Helper functions for updating view state
  const updateFilter = useCallback((filter: Partial<Filter>) => {
    setViewState(prev => ({
      ...prev,
      filter: { ...prev.filter, ...filter }
    }));
  }, []);

  const updateSearch = useCallback((search: string) => {
    setViewState(prev => ({ ...prev, search }));
  }, []);

  if (!isAuthenticated) {return null;}

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
      <div className="sticky top-0 layer-header header-surface z-40">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-matrix-glow mb-2">
              Grading Dashboard
            </h1>
            <p className="text-muted">Review and grade student submissions</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="layer-content container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="matrix-card">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-matrix-glow" />
              <div>
                <p className="text-xs text-muted">Total Graded</p>
                <p className="text-lg font-bold text-bright">{stats.totalGraded}</p>
              </div>
            </div>
          </div>
          <div className="matrix-card">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-matrix-glow" />
              <div>
                <p className="text-xs text-muted">Avg Time</p>
                <p className="text-lg font-bold text-bright">{stats.averageTime}m</p>
              </div>
            </div>
          </div>
          <div className="matrix-card">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-matrix-glow" />
              <div>
                <p className="text-xs text-muted">Today</p>
                <p className="text-lg font-bold text-bright">{stats.today}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="matrix-card mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-dim" />
                  <input
                    type="text"
                    placeholder="Search student or challenge..."
                    value={viewState.search}
                    onChange={(e) => updateSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-matrix-dark rounded text-bright placeholder-dim focus:border-matrix focus:outline-none"
                    aria-label="Search submissions"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-dim" />
                <select
                  value={viewState.filter.status}
                  onChange={(e) => updateFilter({ status: e.target.value })}
                  className="px-3 py-2 bg-black/50 border border-matrix-dark rounded text-bright focus:border-matrix focus:outline-none"
                  aria-label="Filter by status"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {loadingState.error && (
          <ErrorAlert error={loadingState.error} variant="error" />
        )}

        {/* Loading State */}
        {loadingState.isLoading && (
          <div className="text-center py-12">
            <SkeletonTable rows={5} />
          </div>
        )}

        {/* Submissions Table */}
        {!loadingState.isLoading && filteredSubmissions.length === 0 ? (
          <div className="matrix-card text-center py-12">
            <p className="text-muted">No submissions found</p>
          </div>
        ) : (
          <div className="matrix-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-matrix-dark">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredSubmissions.length && filteredSubmissions.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-matrix-dark"
                      aria-label="Select all submissions"
                    />
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-bright cursor-pointer hover:text-matrix transition-colors"
                    onClick={() => toggleSort('student')}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Student</span>
                      {viewState.sort.key === 'student' && (
                        viewState.sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-bright cursor-pointer hover:text-matrix transition-colors"
                    onClick={() => toggleSort('challenge')}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Challenge</span>
                      {viewState.sort.key === 'challenge' && (
                        viewState.sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-bright cursor-pointer hover:text-matrix transition-colors"
                    onClick={() => toggleSort('status')}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {viewState.sort.key === 'status' && (
                        viewState.sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-bright cursor-pointer hover:text-matrix transition-colors"
                    onClick={() => toggleSort('date')}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Submitted</span>
                      {viewState.sort.key === 'date' && (
                        viewState.sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-bright">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-matrix-dark/30 hover:bg-matrix/5 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(sub.id)}
                        onChange={(e) => handleSelectSubmission(sub.id, e.target.checked)}
                        className="rounded border-matrix-dark"
                        aria-label={`Select submission ${sub.id}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3 text-dim" />
                        <span className="text-sm text-bright">
                          {(sub as any).studentName || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-300">
                      {(sub as any).challengeName || 'Unknown Challenge'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(sub.status)}
                        <span className={`text-xs font-semibold`}>
                          {STATUS_CONFIG[sub.status as keyof typeof STATUS_CONFIG]?.label || sub.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-dim">
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => router.push(`/grading/${sub.id}`)}
                        className="text-matrix hover:text-matrix-bright text-xs font-semibold transition-colors"
                        aria-label={`Grade submission ${sub.id}`}
                      >
                        Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
