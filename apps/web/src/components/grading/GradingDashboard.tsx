"use client";

import React, { useMemo, useState } from 'react';
import { useGrading } from '../../lib/grading/context';
import { Submission, SubmissionFilters } from '../../lib/grading/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Button } from '../../lib/ui/button';
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { SubmissionsTable } from '../submissions/SubmissionsTable';

interface GradeModalProps {
  submission: Submission | null;
  onClose: () => void;
  onApprove: (points: number, feedback?: string) => void;
  onReject: (feedback?: string) => void;
}

const GradeModal: React.FC<GradeModalProps> = ({ submission, onClose, onApprove, onReject }) => {
  const [points, setPoints] = useState<number>(submission?.pointsAwarded ?? 0);
  const [feedback, setFeedback] = useState<string>(submission?.feedback ?? '');

  if (!submission) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-2xl p-6 text-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display text-purple-300">Grade Submission</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">✕</button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-neutral-400">Student</div>
              <div className="font-mono">{submission.userName}</div>
            </div>
            <div>
              <div className="text-neutral-400">Activity</div>
              <div className="font-mono">{submission.activityName}</div>
            </div>
          </div>

          <div>
            <div className="text-neutral-400">Description</div>
            <div className="font-body">{submission.description ?? '—'}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">Points</label>
              <input
                type="number"
                value={points}
                onChange={e => setPoints(parseInt(e.target.value || '0', 10))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">Feedback (optional)</label>
              <input
                type="text"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => onReject(feedback)} className="border-red-500/50 text-red-400 hover:bg-red-500/10">
            <XCircle className="h-4 w-4 mr-2" /> Reject
          </Button>
          <Button onClick={() => onApprove(points, feedback)} className="btn-professional btn-primary">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Approve & Award
          </Button>
        </div>
      </div>
    </div>
  );
};

export const GradingDashboard: React.FC = () => {
  const { submissions, search, grade, reload } = useGrading();
  const [filters, setFilters] = useState<SubmissionFilters>({ status: 'pending' });
  const [active, setActive] = useState<Submission | null>(null);

  const filtered = useMemo(() => search(filters), [submissions, filters]);

  const onApprove = async (points: number, feedback?: string) => {
    if (!active) return;
    await grade({ submissionId: active.id, status: 'approved', pointsAwarded: points, feedback });
    setActive(null);
    reload();
  };

  const onReject = async (feedback?: string) => {
    if (!active) return;
    await grade({ submissionId: active.id, status: 'rejected', pointsAwarded: 0, feedback });
    setActive(null);
    reload();
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-300 font-display">Grading Console</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-6 gap-3">
            <input
              placeholder="Search (student, activity, description)"
              className="md:col-span-2 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
              value={filters.q ?? ''}
              onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
            />
            <input
              placeholder="Student name"
              className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
              value={filters.studentName ?? ''}
              onChange={e => setFilters(f => ({ ...f, studentName: e.target.value }))}
            />
            <input
              placeholder="Activity name"
              className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
              value={filters.activityName ?? ''}
              onChange={e => setFilters(f => ({ ...f, activityName: e.target.value }))}
            />
            <select
              className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100"
              value={filters.status ?? 'pending'}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value as any }))}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="flex gap-2">
              <Button variant="outline" className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-800/50" onClick={() => reload()}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubmissionsTable submissions={filtered as any} title={`Submissions (${filtered.length})`} showStudent onReview={(s) => setActive(s as any)} />

      <GradeModal
        submission={active}
        onClose={() => setActive(null)}
        onApprove={onApprove}
        onReject={onReject}
      />
    </div>
  );
};
