'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vulhub/ui';
import { Button } from '@vulhub/ui';
import { Badge } from '@vulhub/ui';
import { Avatar } from '@vulhub/ui';
import { Input } from '@vulhub/ui';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  Users,
  Target,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  totalScore: number;
  totalSubmissions: number;
  approvedSubmissions: number;
  averageScore: number;
  rank: number;
  badges: number;
  lastSubmissionAt?: string;
}

interface LeaderboardStats {
  totalUsers: number;
  totalSubmissions: number;
  averageScore: number;
  topScore: number;
  lastUpdated: string;
}

type TimeRange = 'week' | 'month' | 'all';
type LeaderboardType = 'overall' | 'project' | 'category';

export default function LeaderboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadLeaderboard();
    }
  }, [isAuthenticated, isLoading, router, timeRange, leaderboardType, currentPage]);

  const loadLeaderboard = async () => {
    try {
      setIsLoadingData(true);
      
      // Simulate API call - replace with actual API call
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          userId: '1',
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice@example.com',
          avatarUrl: '/avatars/alice.jpg',
          totalScore: 1250,
          totalSubmissions: 15,
          approvedSubmissions: 12,
          averageScore: 83.3,
          rank: 1,
          badges: 8,
          lastSubmissionAt: '2024-01-15T10:30:00Z',
        },
        {
          userId: '2',
          firstName: 'Bob',
          lastName: 'Smith',
          email: 'bob@example.com',
          totalScore: 1180,
          totalSubmissions: 14,
          approvedSubmissions: 11,
          averageScore: 84.3,
          rank: 2,
          badges: 7,
          lastSubmissionAt: '2024-01-14T15:45:00Z',
        },
        {
          userId: '3',
          firstName: 'Carol',
          lastName: 'Davis',
          email: 'carol@example.com',
          totalScore: 1100,
          totalSubmissions: 13,
          approvedSubmissions: 10,
          averageScore: 84.6,
          rank: 3,
          badges: 6,
          lastSubmissionAt: '2024-01-13T09:20:00Z',
        },
        // Add more mock data...
        ...Array.from({ length: 17 }, (_, i) => ({
          userId: `${i + 4}`,
          firstName: `Student${i + 4}`,
          lastName: 'User',
          email: `student${i + 4}@example.com`,
          totalScore: 1000 - (i * 25),
          totalSubmissions: 12 - i,
          approvedSubmissions: 10 - i,
          averageScore: 80 - (i * 2),
          rank: i + 4,
          badges: 5 - Math.floor(i / 3),
          lastSubmissionAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        })),
      ];

      const mockStats: LeaderboardStats = {
        totalUsers: 150,
        totalSubmissions: 1250,
        averageScore: 75.5,
        topScore: 1250,
        lastUpdated: new Date().toISOString(),
      };

      setLeaderboard(mockLeaderboard);
      setStats(mockStats);
      setTotalPages(4);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-medium text-gray-500">#{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-100 text-yellow-800">🥇 1st</Badge>;
    if (rank === 2) return <Badge className="bg-gray-100 text-gray-800">🥈 2nd</Badge>;
    if (rank === 3) return <Badge className="bg-amber-100 text-amber-800">🥉 3rd</Badge>;
    if (rank <= 10) return <Badge variant="secondary">Top 10</Badge>;
    return null;
  };

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoadingData && !leaderboard.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Trophy className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Leaderboard
              </h1>
            </div>
            <Button
              onClick={loadLeaderboard}
              variant="outline"
              size="sm"
              disabled={isLoadingData}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Active learners
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  Challenges completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Out of 100
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Score</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.topScore}</div>
                <p className="text-xs text-muted-foreground">
                  Highest achieved
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Time Range Filter */}
              <div className="flex space-x-2">
                <Button
                  variant={timeRange === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('week')}
                >
                  This Week
                </Button>
                <Button
                  variant={timeRange === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('month')}
                >
                  This Month
                </Button>
                <Button
                  variant={timeRange === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('all')}
                >
                  All Time
                </Button>
              </div>

              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Rankings</span>
            </CardTitle>
            <CardDescription>
              Current standings based on total score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredLeaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    entry.userId === user?.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 text-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      {entry.avatarUrl ? (
                        <img src={entry.avatarUrl} alt={`${entry.firstName} ${entry.lastName}`} />
                      ) : (
                        <div className="bg-blue-600 text-white text-sm font-medium">
                          {entry.firstName[0]}{entry.lastName[0]}
                        </div>
                      )}
                    </Avatar>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {entry.firstName} {entry.lastName}
                      </p>
                      {getRankBadge(entry.rank)}
                      {entry.userId === user?.id && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.approvedSubmissions}/{entry.totalSubmissions} submissions
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {entry.totalScore}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.averageScore.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {entry.badges}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Badges</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, leaderboard.length)} of {leaderboard.length} results
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
