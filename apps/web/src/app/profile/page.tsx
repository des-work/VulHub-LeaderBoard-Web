"use client";

import React, { useMemo, useState } from 'react';
import { useAuth } from '../../lib/auth/context';
import { useGrading } from '../../lib/grading/context';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { evaluateBadges } from '../../lib/badges/evaluator';
import { badgeCatalog } from '../../lib/badges/catalog';
import { challengeCatalog } from '../../lib/challenges/catalog';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { SubmissionsTable } from '../../components/submissions/SubmissionsTable';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const { submissions } = useGrading();

  if (!user) return null;

  const mySubs = submissions.filter(s => s.userId === user.id);

  const badgeProgress = useMemo(() => evaluateBadges(user.points, mySubs, badgeCatalog, challengeCatalog), [user.points, mySubs]);

  const completedByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of mySubs.filter(s => s.status === 'approved')) {
      const ch = challengeCatalog.challenges.find(c => c.title === s.activityName || c.cve === s.activityName);
      if (ch) map[ch.category] = (map[ch.category] || 0) + 1;
    }
    return map;
  }, [mySubs]);

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body">
      <div className="container mx-auto px-4 py-10 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-300 font-display flex items-center justify-between">
              <span className="flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-neutral-700" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm">
                    {user.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                )}
                {user.name}
              </span>
              <button onClick={() => setEditing(true)} className="text-sm px-3 py-1 rounded border border-neutral-600/50 hover:bg-neutral-800/50">Edit Profile</button>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-neutral-400">Points</div>
              <div className="text-3xl font-mono text-purple-300">{user.points.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-neutral-400">Level</div>
              <div className="text-3xl font-mono text-purple-300">{user.level}</div>
            </div>
            <div>
              <div className="text-neutral-400">Joined</div>
              <div className="text-3xl font-mono text-purple-300">{new Date(user.joinDate).toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>

        {user.bio && (
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-300 font-display">Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300 whitespace-pre-wrap">{user.bio}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-purple-300 font-display">Progress by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(completedByCategory).length === 0 ? (
              <div className="text-neutral-400">No approved submissions yet.</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(completedByCategory).map(([cat, n]) => (
                  <div key={cat} className="bg-neutral-900 border border-neutral-800 rounded p-3">
                    <div className="text-neutral-400 text-sm">{cat}</div>
                    <div className="text-2xl font-mono text-purple-200">{n}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-purple-300 font-display">Unlocked Badges</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {badgeProgress.unlocked.length === 0 ? (
              <div className="text-neutral-400">No badges unlocked yet.</div>
            ) : (
              badgeProgress.unlocked.map(b => (
                <span key={b.id} className="inline-flex items-center px-3 py-2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  {b.name}
                </span>
              ))
            )}
          </CardContent>
        </Card>

        <SubmissionsTable submissions={mySubs as any} title="Your Submissions" />
      </div>
      <EditProfileModal open={editing} onClose={() => setEditing(false)} />
    </div>
  );
}
