"use client";

import React, { useMemo, useState } from 'react';
import { Submission } from '../../lib/auth/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Button } from '../../lib/ui/button';

export interface SubmissionsTableProps {
  submissions: Submission[];
  title?: string;
  showStudent?: boolean;
  onReview?: (submission: Submission) => void;
}

const statusTabs: Array<'all' | Submission['status']> = ['all', 'pending', 'approved', 'rejected'];

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ submissions, title = 'Submissions', showStudent = false, onReview }) => {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<typeof statusTabs[number]>('all');

  const list = useMemo(() => {
    return submissions.filter(s => {
      if (status !== 'all' && s.status !== status) return false;
      if (q && !(`${s.activityName} ${s.description}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [submissions, status, q]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-purple-300 font-display">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <input className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100" placeholder="Search activity or description" value={q} onChange={e => setQ(e.target.value)} />
          <select className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100" value={status} onChange={e => setStatus(e.target.value as any)}>
            {statusTabs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-neutral-400">
              <tr className="border-b border-neutral-800">
                <th className="text-left py-2 pr-4">Date</th>
                {showStudent && <th className="text-left py-2 pr-4">Student</th>}
                <th className="text-left py-2 pr-4">Activity</th>
                <th className="text-left py-2 pr-4">Status</th>
                <th className="text-left py-2 pr-4">Points</th>
                {onReview && <th className="text-left py-2 pr-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {list.map(s => (
                <tr key={s.id} className="border-b border-neutral-900 hover:bg-neutral-900/40">
                  <td className="py-2 pr-4 font-mono text-neutral-400">{new Date(s.submittedAt).toLocaleString()}</td>
                  {showStudent && <td className="py-2 pr-4">{s.userId}</td>}
                  <td className="py-2 pr-4">{s.activityName}</td>
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      s.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      : s.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>{s.status}</span>
                  </td>
                  <td className="py-2 pr-4">{s.pointsAwarded ?? '—'}</td>
                  {onReview && (
                    <td className="py-2 pr-4">
                      <Button size="sm" className="btn-professional btn-primary" onClick={() => onReview(s)}>Review</Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
