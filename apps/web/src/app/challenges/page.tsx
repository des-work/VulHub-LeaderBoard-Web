"use client";

import React, { useMemo, useState } from 'react';
import { challengeCatalog } from '../../lib/challenges/catalog';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Button } from '../../lib/ui/button';
import { Flame, Sword, Shield, Filter, Tag, Rocket } from 'lucide-react';

export default function ChallengesPage() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    challengeCatalog.challenges.forEach(c => set.add(c.category));
    return ['all', ...Array.from(set)];
  }, []);

  const list = useMemo(() => {
    return challengeCatalog.challenges.filter(c => {
      if (category !== 'all' && c.category !== category) return false;
      if (q && !(`${c.title} ${c.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [q, category]);

  const RouteChip = ({ id }: { id: string }) => {
    const map: Record<string, { label: string; icon: React.ReactNode }> = {
      standard: { label: 'Standard', icon: <Rocket className="h-3 w-3 mr-1"/> },
      redTeam: { label: 'Red', icon: <Sword className="h-3 w-3 mr-1"/> },
      blueTeam: { label: 'Blue', icon: <Shield className="h-3 w-3 mr-1"/> },
    };
    const item = map[id] || { label: id, icon: null };
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/30 mr-2">{item.icon}{item.label}</span>;
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display text-purple-300 spectacular-text-glow">Challenges</h1>
          <p className="text-neutral-400 mt-2">Mapped to official Vulhub environments. Pick a route and start hacking.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-purple-300 font-display">Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-3">
            <input className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100" placeholder="Search title or tags" value={q} onChange={e => setQ(e.target.value)} />
            <select className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(ch => (
            <Card key={ch.id} className="spectacular-hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-purple-200 font-display">{ch.title}</span>
                  <span className="text-sm text-yellow-300 inline-flex items-center"><Flame className="h-4 w-4 mr-1"/>{ch.defaultPoints} pts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-neutral-400 text-sm">{ch.category} {ch.cve ? `• ${ch.cve}` : ''}</div>
                <div>
                  {ch.routeIds.map(id => <RouteChip key={id} id={id} />)}
                </div>
                <div>
                  {ch.tags.map(t => <span key={t} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-neutral-800 text-neutral-300 border border-neutral-700 mr-2"><Tag className="h-3 w-3 mr-1"/>{t}</span>)}
                </div>
                <a className="text-sm text-purple-300 underline" href={ch.vulhub.url} target="_blank" rel="noreferrer">Vulhub docs</a>
                <div className="pt-2">
                  <Button className="btn-professional btn-primary w-full">Start • {ch.difficulty}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
