"use client";

import React, { useMemo, useState } from 'react';
import { badgeCatalog } from '../../lib/badges/catalog';
import { Badge, BadgeTier } from '../../lib/badges/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Button } from '../../lib/ui/button';
import { Award, Star, Crown, Shield, Lock } from 'lucide-react';
import { useAuth } from '../../lib/auth/context';
import { useGrading } from '../../lib/grading/context';
import { evaluateBadges } from '../../lib/badges/evaluator';
import './badges.css';

const TierChip: React.FC<{ tier: BadgeTier }> = ({ tier }) => {
  const colors: Record<BadgeTier, string> = {
    bronze: 'text-amber-600',
    silver: 'text-gray-300',
    gold: 'text-yellow-400',
    platinum: 'text-purple-300',
  };
  const icons: Record<BadgeTier, React.ReactNode> = {
    bronze: <Shield className="h-4 w-4 mr-1"/>,
    silver: <Star className="h-4 w-4 mr-1"/>,
    gold: <Crown className="h-4 w-4 mr-1"/>,
    platinum: <Award className="h-4 w-4 mr-1"/>,
  };
  return <span className={`inline-flex items-center text-xs ${colors[tier]}`}>{icons[tier]} {tier}</span>;
};

// Simple unique art per-badge (placeholder gradients/emojis). In a real app, swap to SVGs.
const BadgeArt: React.FC<{ id: string; anim: string } > = ({ id, anim }) => {
  const palette: Array<[string, string]> = [
    ['from-purple-500 to-pink-500', '🛡️'],
    ['from-yellow-400 to-rose-400', '⚡'],
    ['from-emerald-400 to-cyan-400', '🧠'],
    ['from-indigo-400 to-purple-600', '🔥'],
    ['from-orange-400 to-amber-500', '🏆'],
  ];
  const idx = Math.abs(Array.from(id).reduce((a, c) => a + c.charCodeAt(0), 0)) % palette.length;
  const [grad, emoji] = palette[idx];
  return (
    <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-3xl shadow-lg ${anim}`}>
      <span>{emoji}</span>
    </div>
  );
};

function getAnimForBadge(id: string, locked: boolean) {
  const anims = ['anim-shimmer','anim-rotate3d','anim-glowPulse','anim-orbit','anim-flare'];
  const idx = Math.abs(Array.from(id).reduce((a,c)=>a+c.charCodeAt(0),0)) % anims.length;
  return locked ? 'anim-shimmer' : anims[idx];
}

function ProgressForBadge({ badge, points }: { badge: Badge; points: number }) {
  const items = badge.requirements.map((r) => {
    if (r.type === 'points') {
      const need = r.points || 0; const have = Math.min(points, need); const pct = need ? Math.round((have/need)*100) : 100;
      return { label: `Points ${have}/${need}`, pct };
    }
    if (r.type === 'complete-category' && r.count) {
      // Placeholder: in a full impl, pass category completion counts; show 0/x for now
      return { label: `${r.category} 0/${r.count}`, pct: 0 };
    }
    if (r.type === 'complete-cve') { return { label: `${r.cve}`, pct: 0 }; }
    if (r.type === 'route-step') { return { label: `${r.routeId}/${r.stepId}`, pct: 0 }; }
    if (r.type === 'streak') { return { label: `Streak ${r.count}`, pct: 0 }; }
    return { label: 'Requirement', pct: 0 };
  });
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i}>
          <div className="text-xs text-neutral-400 mb-1">{it.label}</div>
          <div className="badge-progress"><span style={{ width: `${it.pct}%` }}></span></div>
        </div>
      ))}
    </div>
  );
}

export default function BadgesPage() {
  const [view, setView] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [tier, setTier] = useState<'all' | BadgeTier>('all');
  const [q, setQ] = useState('');

  const { user } = useAuth();
  const { submissions } = useGrading();

  const progress = useMemo(() => evaluateBadges(user?.points || 0, submissions || [], badgeCatalog, { routes: {} as any, challenges: [] as any }), [user?.points, submissions]);

  const allBadges: Array<{ badge: Badge; locked: boolean }> = useMemo(() => {
    const unlockedSet = new Set(progress.unlocked.map(b => b.id));
    return badgeCatalog.badges
      .filter(b => (tier === 'all' ? true : b.tier === tier))
      .filter(b => (q ? `${b.name} ${b.description}`.toLowerCase().includes(q.toLowerCase()) : true))
      .map(b => ({ badge: b, locked: !unlockedSet.has(b.id) }))
      .filter(entry => (view === 'all' ? true : view === 'locked' ? entry.locked : !entry.locked));
  }, [tier, q, view, progress]);

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display text-purple-300 spectacular-text-glow">Badges</h1>
          <p className="text-neutral-400 mt-2">Unlock badges through challenges, routes, and milestones. Locked badges are grayed out until earned.</p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-purple-300 font-display">Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-3">
            <input className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100" placeholder="Search badges" value={q} onChange={e => setQ(e.target.value)} />
            <select className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100" value={view} onChange={e => setView(e.target.value as any)}>
              <option value="all">All</option>
              <option value="unlocked">Unlocked</option>
              <option value="locked">Locked</option>
            </select>
            <select className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100" value={tier} onChange={e => setTier(e.target.value as any)}>
              {(['all','bronze','silver','gold','platinum'] as const).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </CardContent>
        </Card>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBadges.map(({ badge, locked }) => (
            <Card key={badge.id} className={`spectacular-hover-lift relative reveal-enter ${locked ? 'opacity-60 grayscale' : ''}`}>
              {locked && (
                <div className="absolute top-3 right-3 text-neutral-400 flex items-center">
                  <Lock className="h-4 w-4 mr-1"/> Locked
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-purple-200 font-display">{badge.name}</span>
                  <TierChip tier={badge.tier} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <BadgeArt id={badge.id} anim={getAnimForBadge(badge.id, locked)} />
                  <p className="text-neutral-300 text-sm">{badge.description}</p>
                </div>
                <div className="text-xs text-neutral-400">
                  Requirements:
                  <ul className="list-disc list-inside">
                    {badge.requirements.map((r, i) => (
                      <li key={i}>
                        {r.type === 'points' && <>Reach {r.points} points.</>}
                        {r.type === 'complete-category' && <>Complete {r.count} challenge(s) in <span className="font-mono">{r.category}</span>.</>}
                        {r.type === 'complete-cve' && <>Complete <span className="font-mono">{r.cve}</span>.</>}
                        {r.type === 'route-step' && <>Complete <span className="font-mono">{r.routeId}/{r.stepId}</span> step.</>}
                        {r.type === 'streak' && <>Maintain a streak of {r.count}.</>}
                      </li>
                    ))}
                  </ul>
                </div>
                <ProgressForBadge badge={badge} points={user?.points || 0} />
                <div className="pt-2 flex items-center justify-end">
                  {locked ? (
                    <Button variant="outline" className="border-neutral-600/50" disabled>Locked</Button>
                  ) : (
                    <Button className="btn-professional btn-primary">View Details</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
